const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = "https://yyrrfugxuaysojptdndm.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cnJmdWd4dWF5c29qcHRkbmRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA3MDE2MSwiZXhwIjoyMDkwNjQ2MTYxfQ.RuOVZNEgMjo620-9cidI6aWNnHL2A08hqCiUgUDIVUY"; // NÃO EXPONHA NO FRONTEND

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

app.post("/api/create-user", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    // Cria usuário no Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw error;

    // Insere perfil com role na tabela profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{ id: data.user.id, role }]);

    if (profileError) throw profileError;

    res.json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});