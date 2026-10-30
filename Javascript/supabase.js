async function sendCode(email) {
    const { error } = await supabase.auth.signInWithOtp({
        email: email
    });

    if (error) {
        console.error(error.message);
        return false;
    }

    return true;
}
async function verifyCode(email, code) {
    const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: 'email'
    });

    if (error) {
        console.error(error.message);
        return false;
    }

    return true;
}
async function checkAccess() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
        window.location.href = "/login/";
        return false;
    }

    return true;
}