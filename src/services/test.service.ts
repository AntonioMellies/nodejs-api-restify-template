class TestService {

    findAll(req, resp, next) {
        resp.json({ mensagem: "Resp. Find All" })
        next();
    }

    findById(req, resp, next) {
        resp.json({ mensagem: "Resp Find by ID" })
        next();
    }

}
export default new TestService();