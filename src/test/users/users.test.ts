import { environment } from '../../server/environment';
import { Server } from './../../server/server';
import { User } from './../../models/user.model';

import 'jest'
import * as request from 'supertest'

let address: string
let server: Server
beforeAll(() => {
    environment.db.url = process.env.DB_URL || "mongodb://user:secret@localhost:27016/nodejs-api-restify-template-test"
    environment.server.port = process.env.SERVER_PORT || 3001
    address = `http://localhost:${environment.server.port}`
    server = new Server();
    return server.bootstrap()
        .then(() => User.remove({}).exec())
        .catch(console.error)
})

test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
})

test('get /users/aaaaa - not found', () => {
    return request(address)
        .get('/users/aaaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Nome',
            email: 'email@emailteste.com',
            password: 'senha'
        })
        .then(response => {
            expect(response.status).toBe(201)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Nome')
            expect(response.body.email).toBe('email@emailteste.com')
            expect(response.body.active).toBe(true)
            expect(response.body.userType).toBe('user')
            expect(response.body.password).toBeUndefined()
        })
})


test('patch /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Nome 2',
            email: 'email2@emailteste.com',
            password: 'senha'
        }).then(response => {
            return request(address)
                .patch(`/users/${response.body._id}`)
                .send({
                    name: 'Nome 3',
                    email: 'email3@emailteste.com'
                })
        }).then(response2 => {
            expect(response2.body._id).toBeDefined()
            expect(response2.body.name).toBe('Nome 3')
            expect(response2.body.email).toBe('email3@emailteste.com')
            expect(response2.body.password).toBeUndefined()
        })
})

afterAll(() => {
    return server.shutdown()
})