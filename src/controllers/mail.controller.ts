//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import { Request, Response } from 'express';

//* Function imports
import sendMail from '../utils/sendMail';

//* ------------------- Controllers ------------------- *\\

/**
 * Sends a mail with body data.
 *
 * @param {Request} req
 * @param {Response} res
 */
async function mailController(req: Request, res: Response) {
  const { to, subject, html } = req.body;

  sendMail(to, subject, html, async (emailRes: any) => {
    if (!emailRes.success) {
      res.status(400).json(emailRes);
    } else {
      res.status(200).json(emailRes);
    }
  });
}

//* --------------------- EXPORTS --------------------- *\\

export default mailController;
