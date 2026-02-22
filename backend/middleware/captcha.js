const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const verifyCaptcha = async (req, res, next) => {
    // Skip captcha in development if no secret key configured
    if (!process.env.TURNSTILE_SECRET_KEY) {
        return next();
    }

    const captchaToken = req.body.captchaToken;
    if (!captchaToken) {
        return res.status(400).json({
            success: false,
            message: 'CAPTCHA doğrulaması gerekli'
        });
    }

    try {
        const response = await fetch(TURNSTILE_VERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: captchaToken,
                remoteip: req.ip
            })
        });

        const data = await response.json();

        if (!data.success) {
            return res.status(400).json({
                success: false,
                message: 'CAPTCHA doğrulaması başarısız. Lütfen tekrar deneyin.'
            });
        }

        next();
    } catch (error) {
        console.error('Captcha verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'CAPTCHA doğrulanırken bir hata oluştu.'
        });
    }
};

module.exports = { verifyCaptcha };
