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

    const translateToEnglish = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `
        The text may be in any language or urdu.
        You have to translate it to english.
        Please translate the following text to english.
        The meaning should never change.
        The text is:
        ${prompt}`,
        // prompt: "What is javascript?",
        max_tokens: 3048,
        temperature: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0
    });

    const englishPrompt = translateToEnglish.data.choices[0].text?.trim() || 'Sorry, there was a problem!';

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
        "Welcome to takhti online learning management system"
        You must say "I am fine! How are you by the way! Welcome to takhti online learning management system"
        When someone asks you how are you just say that.
        Reply with "I am fine! How are you by the way! Welcome to takhti online learning management system" when someone asks you how are you or hi or greeting.
        If some one asks you "Who developed this system?" then you have to reply "I have been developed by takhti online learning management system"
        You have to act as a great scientist and engineer and a computer scientist.
        You have to help with any subject that is related to the project and general knowledge.
        Whenever a scientific question is asked always answer it related to science dont say anything related to project but at the end that from takhti online.
        Now you have to answer the following question according to the above instructions:-
        ${translateToEnglish}`,
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
