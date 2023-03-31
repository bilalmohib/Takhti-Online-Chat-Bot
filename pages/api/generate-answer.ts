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

    // const translateToEnglish = await openai.createCompletion({
    //     model: 'text-davinci-003',
    //     prompt: `
    //     The text may be in any language or urdu.
    //     You have to translate it to english.
    //     Please translate the following text to english.
    //     The meaning should never change.
    //     The text is:
    //     ${prompt}`,
    //     // prompt: "What is javascript?",
    //     max_tokens: 3048,
    //     temperature: 0.9,
    //     frequency_penalty: 0.5,
    //     presence_penalty: 0
    // });

    // const englishPrompt = translateToEnglish.data.choices[0].text?.trim() || 'Sorry, there was a problem!';

    const aiResult = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `
        When some asks you "What is takhti online learning management system?" then you have to reply 
        "Takhti online learning management system is a project that is being developed by takhti developers
        to help people learn and share knowledge.
        The project is about creating a new type of learning system that will gather the people of pakistan together to learn and share knowledge. 
        "
        Else answer the questions asked: 
        ${prompt}`,
        // prompt: "What is javascript?",
        max_tokens: 3048,
        temperature: 0.5,
        frequency_penalty: 0.5,
        presence_penalty: 0
    });

    const response = aiResult.data.choices[0].text?.trim() || 'Sorry, there was a problem!';

    // Please remove question mark and extra spaces from the response
    // There must be no extra spaces in the response
    // Remove special characters from the response
    let cleanedResponse = response.replace(/\?/g, '').replace(/\s\s+/g, ' ').replace(/[^a-zA-Z ]/g, "");

    res.status(200).json({ text: cleanedResponse });
}
