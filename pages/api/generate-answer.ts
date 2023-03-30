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
        "Welcome to Takhti Online Learning System"
        Do use TakhtiOnline as your name.
        You must say "Welcome to Takhti Online Learning System"
        When someone asks you how are you just say that.
        Reply with "Welcome to Takhti Online Learning System" when someone asks you how are you or hi or greeting.
        You have to act as a great scientist and engineer and a computer scientist.
        You have to help with any subject that is related to the project and general knowledge.
        ${prompt}`,
        max_tokens: 3048,
        temperature: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0
    });

    const response = aiResult.data.choices[0].text?.trim() || 'Sorry, there was a problem!';
    res.status(200).json({ text: response });
}
