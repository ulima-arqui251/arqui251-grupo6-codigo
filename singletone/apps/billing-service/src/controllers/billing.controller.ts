import { Request, Response } from 'express';

// GET /billing/health
export function health(req: Request, res: Response) {
    return res.status(200).json({ status: 'ok', service: 'billing-service' });
}

// POST /billing/create-checkout
export function createCheckoutSession(req: Request, res: Response) {
    const { planId } = req.body;

    // Aquí iría la integración real con Stripe
    // Ejemplo:
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{ price: planId, quantity: 1 }],
    //   mode: 'subscription',
    //   success_url: 'https://tusitio.com/success',
    //   cancel_url: 'https://tusitio.com/cancel',
    // });

    return res.json({
        mock: true,
        message: `Simulación de creación de sesión de pago para plan: ${planId}`,
        checkoutUrl: `https://mock.stripe.com/checkout/${planId}`,
    });
}

// GET /billing/status/:sessionId
export function getPaymentStatus(req: Request, res: Response) {
    const { sessionId } = req.params;

    // Aquí iría la lógica para verificar el estado del pago real desde Stripe
    // Ejemplo:
    // const session = await stripe.checkout.sessions.retrieve(sessionId);
    // return res.json({ status: session.payment_status });

    return res.json({
        mock: true,
        sessionId,
        status: 'success',
        message: 'Simulación de verificación de pago exitosa',
    });
}