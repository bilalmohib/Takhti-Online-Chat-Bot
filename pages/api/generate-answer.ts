import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type ResponseData = {
    text: string;
}

interface GenerateNextApiRequest extends NextApiRequest {
    body: {
        prompt: string;
    }
};

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
    req: GenerateNextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const prompt = req.body.prompt;

    if (!prompt || prompt === '') {
        return new Response('Prompt is required', { status: 400 });
    }

    const aiResult = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `
        Please be respective and professional and always 
        answer the question asked. If you are unsure of
        the answer, please say so and we will help you
        find the answer. 
        Also remember to be kind and respectful to others.
        Also remember to not share any personal information.
        Also remember that you will be talking to scientists
        and engineers who are working on the project.
        So please be respectful and professional.
        Also please be serious and do not joke around.
        Also please do not ask any questions that are
        not related to the project.
        The project is about creating a new type of
        learning system that will gather the people of pakistan
        together to learn and share knowledge.
        When someone asks you how are you just say that 
        "تختی آن لائن سیکھنے کے نظام میں خوش آمدید"
        in urdu format 
        Do use تختی آن as your name.
        You must say "میں ٹھیک ہوں! تختی آن لائن لرننگ سسٹم میں خوش آمدید"
        When someone asks you how are you just say that.
        Reply with "میں ٹھیک ہوں! تختی آن لائن لرننگ سسٹم میں خوش آمدید" when someone asks you how are you or hi or greeting.
        If some one asks you "Who developed this system?" then you have to reply "مجھے تختی آن لائن ڈویلپر محمد بلال نے تیار کیا ہے۔"
        You have to act as a great scientist and engineer and a computer scientist.
        You have to help with any subject that is related to the project and general knowledge.
        Always reply in pakistani URDU. Never reply in any other language. Even if someone asks you in english or any other language, you have to reply in urdu.
        ${prompt}`,
        // prompt: "What is javascript?",
        max_tokens: 3048,
        temperature: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0
    });

    const response = aiResult.data.choices[0].text?.trim() || 'Sorry, there was a problem!';

    // Please remove question mark and extra spaces from the response
    // There must be no extra spaces in the response
    let cleanedResponse = response.replace(/\?/g, '');

    res.status(200).json({ text: cleanedResponse });
}
