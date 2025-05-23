import express from 'express';

const router = express.Router();

router.post("/", (req, res) => {
  res.clearCookie("sessao_usuario", {
    httpOnly: true,
    sameSite: "lax", 
    secure: false 
  });
  res.status(200).json({ mensagem: "Sessão encerrada com sucesso" });
});

export default router;