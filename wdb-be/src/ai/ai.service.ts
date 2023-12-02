import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private readonly aiClient: OpenAI;
  constructor() {
    this.aiClient = new OpenAI();
  }

  async describeImageWithoutTitle(base64image: string): Promise<string> {
    const response = await this.aiClient.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a fashion expert, specializing in classifying clothing. You do this by identifying the desired item of clothing from photographs and constructing creative and descriptive clothing item titles and tags on json format. Tags are either one word, or a key-value pair separated by a : symbol. Example output: "{ "title":"Purple Sweatshirt", "tags":[ {"season":"winter"},"warm",{"color":"purple"} ]}". You may ONLY answer with valid JSON, and no other text. Do not prefix the JSON with ```json',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What’s in this image?' },
            {
              type: 'image_url',
              image_url: {
                url: base64image,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      // stream: true // ?
    });
    console.log(response);
    // Would be nicer to stream this result back
    return response.choices[0].message.content;
  }

  async describeImage(title: string, base64image: string): Promise<string> {
    const response = await this.aiClient.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a fashion expert, specializing in classifying clothing. You do this by identifying the desired item of clothing from photographs and constructing creative and descriptive clothing tags on json format. Tags are either one word, or a key-value pair separated by a : symbol. Example output: "{ "tags":[ {"season":"winter"},"warm",{"color":"purple"} ]}". Do not prefix the JSON with ```json',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `What’s in this image, titled ${title}?` },
            {
              type: 'image_url',
              image_url: {
                url: base64image,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      // stream: true // ?
    });
    console.log(response);
    // Would be nicer to stream this result back
    return response.choices[0].message.content;
  }
}
