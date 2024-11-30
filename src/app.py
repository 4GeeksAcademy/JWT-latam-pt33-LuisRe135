"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = "secreto-divertido"  
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# generate token 
@app.route("/token", methods=["POST"])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # Query your database for username and password
    user = User.query.filter_by(username=username, password=password).first()

    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad username or password"}), 401
    
    # Create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id })

# signup endpoint
@app.route('/signup', methods=['POST'])
def signup():

    name = request.json.get("name", None)
    password = request.json.get("password", None)

    if not name:
        return jsonify({"msg": "Falta el nombre"}), 401
    
    if not password:
        return jsonify({"msg": "Falta la contraseña"}), 401

    user_exists = User.query.filter_by(name=name).first()
    
    if user_exists:
         return jsonify({'error': 'user already exists.'}), 409
    
    new_user = User(name=name, password=password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "user": new_user.serialize()
        # "token": create_access_token(identity=new_user.id)
                    }), 201

# login endpoint
@app.route('/login', methods=['POST'])
def login():
    name = request.json.get("name", None)
    password = request.json.get("password", None)

    if not name or not password:
        return jsonify({'error': 'missing fields.'}), 400
    
    user_exists = User.query.filter_by(name=name).first()
    if not user_exists:
       return jsonify({'error': 'user not found.'}), 401
    
    if password != user_exists.password:
        return jsonify({'error': 'wrong password'}), 401
    
    user_id = user_exists.id
    token = create_access_token(identity=user_id)

    return jsonify({
        "user": user_exists.serialize(),
        "token": token
                    }), 200

# private endpoint to show the use of token
@app.route('/private', methods=['GET'])
@jwt_required()
def private():

    recovered_id = get_jwt_identity()
    user = User.query.get(recovered_id)

    return jsonify({'my_user': user.serialize()}), 200


# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
