use actix_web::web;

use crate::{handlers::auth_handler, middleware::jwt_middleware::VerifyJWT};

pub fn config(config: &mut web::ServiceConfig, jwt_middleware: VerifyJWT) {
    config.service(
        web::scope("/v1/auth")
        .service(auth_handler::register)
        .service(auth_handler::login)
        .service(auth_handler::logout)
        .service(auth_handler::refresh)
        .service(
            web::scope("")
            .service(auth_handler::retrive_user)
            .wrap(jwt_middleware)
        )
    );
}