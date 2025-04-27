export function getAuthErrorMessage(error: any): string {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Email inválido.';

        case 'auth/user-disabled':
            return 'Usuário desativado.';

        case 'auth/user-not-found':
            return 'Usuário não encontrado.';

        case 'auth/wrong-password':
            return 'Senha incorreta.';

        case 'auth/email-already-in-use':
            return 'Este email já está em uso.';

        case 'auth/weak-password':
            return 'Senha muito fraca. Use ao menos 6 caracteres.';

        case 'auth/invalid-credential':
            return 'Credenciais inválidas.';

        default:
            return `Erro desconhecido, tente novamente. Erro: ${error.message}`;
    }
}
