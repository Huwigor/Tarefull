import express from 'express';
import dotenv from 'dotenv';

dotenv.config()

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    res.clearCookie("sessao_usuario", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({ mensagem: "Sessão encerrada com sucesso" });

  } catch (error) {
    console.error("Erro no logout:", error);
    res.status(500).json({ mensagem: "Erro ao encerrar a sessão" });
  }
});

export default router;