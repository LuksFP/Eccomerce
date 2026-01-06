-- A política "Users can view their own profile" já foi criada
-- Verificar se existe e criar política para admin poder ver todos perfis se necessário

-- Criar política para admins poderem ver todos os perfis (necessário para funcionalidades admin)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));