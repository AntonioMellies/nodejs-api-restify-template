class TestService {

    findAll(req, resp, next) {
        resp.json({ mensagem: "Resposta" })
        next();
    }

}
export default new TestService();