import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  constructor() {}

  async doSomeOpenAiShit(): Promise<string> {
    const client = new OpenAI();

    const response = await client.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What’s in this image?' },
            {
              type: 'image_url',
              image_url: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg',
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      // stream: true // ?
    });
    // Would be nicer to stream this result back
    return response.choices[0].message.content;
  }
}
