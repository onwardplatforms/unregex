"use client"

import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import languageMap from './data';
import { Textarea } from '@/components/ui/textarea'
import { Copybox } from '@/components/ui/copybox'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { Toggle } from "@/components/ui/toggle"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {
  type LanguageKey = keyof typeof languageMap;

  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [language, setLanguage] = useState<LanguageKey>('python');
  const [textCount, setTextCount] = useState(0);
  const [regex_pattern, setRegexPattern] = useState("");
  const [code_example, setCodeExample] = useState("");
  const [explanation, setExplanation] = useState("");
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // const isButtonDisabled = !text || !context || !language;
  const [validationError, setValidationError] = useState<{ text?: boolean, context?: boolean, language?: boolean, textLength?: boolean }>({});

  const handleLanguageChange = (value: string) => {
    if (Object.keys(languageMap).includes(value)) {
      setLanguage(value as LanguageKey);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setTextCount(e.target.value.length);
    setValidationError(prevState => ({ ...prevState, text: false, textLength: false }));
  };

  const handleGenerateRegex = async () => {
    // Reset validation state and output fields
    setValidationError({});
    setRegexPattern("");
    setCodeExample("");
    setExplanation("");
    setApiError(null);

    const isTextTooLong = text.length > 1000;

    if (!text || !context || !language || isTextTooLong) {
      setValidationError({
        text: !text,
        context: !context,
        language: !language,
        textLength: isTextTooLong,
      });
      return;
    }

    setApiError(null);
    setIsLoading(true);

    const prompt = `
      Given this text:
      \`${text}\`
    
      I want to write valid regex for the programming language "${languageMap[language]}" given this context:
      \`${context}\`
    
      Return the response as a json object that looks like this:
    
      \`\`\`json
      {
        "regex_pattern": "The regex pattern",
        "code_example": "A code example that includes all required imports and logic",
        "explanation": "A breakdown of the regex components and how it works"
      }
      \`\`\`
    
      ONLY return json.  ALWAYS ensure to escape all special characters and backslashes (e.g. \\\\d instead of \\d in the response to produce valid JSON.  DO NOT explain.
    `;

    console.log(prompt)

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are an expert at writing regex and love helping people write robust and valid regex."
          },
          {
            "role": "user",
            "content": prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2500
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      const chatOutput = response.data.choices[0].message.content;
      console.log(chatOutput)

      try {
        const regexOutput = JSON.parse(chatOutput);
        console.log(regexOutput)

        setRegexPattern(regexOutput.regex_pattern);
        setCodeExample(regexOutput.code_example);
        setExplanation(regexOutput.explanation);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error parsing JSON: ', error);
        setApiError(error.toString());
        setIsLoading(false);
      }

    } catch (error: any) {
      console.error('Error interacting with OpenAI API: ', error);
      setApiError(error.toString());
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center p-6">
      <Head>
        <title>Unregex: The #1 AI-Powered Regex Generator Online</title>
        <meta name="description" content="Unregex is your go-to AI-powered Regex Generator. Simplify and enhance your regular expression tasks instantly. Try now!" />
        <link rel="canonical" href="https://unregex.com/" />
        <meta name="language" content="EN" />
      </Head>
      <h1 className="text-4xl lg:text-6xl p-4">Unregex</h1>
      <p className="pb-4">Where <b>[rR]eg[eE][xX]</b> writes itself.</p>
      <div className="flex flex-col lg:items-stretch lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 z-10 max-w-5xl w-full items-center justify-between text-sm">
        <Card className="w-full lg:w-[50%]">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Define what you want to extract ...</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="my-4">Text</p>
              <Textarea
                value={text}
                onChange={handleTextChange}
                maxLength={1000}
                className={`${validationError.text || validationError.textLength ? 'border-red-500' : ''}`}
              />
            </div>
            <div>
              {validationError.textLength && <div className="text-red-500 text-sm">Text should be less than 1000 characters.</div>}
              <div className="text-right mt-1 text-sm text-gray-500">{textCount}/1000</div>
              <p className="my-4">Context</p>
              <Textarea
                className={`my-4 ${validationError.context ? 'border-red-500' : ''}`}
                placeholder="I want to extract..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div>
              <p className="my-4">Language</p>
              <Select onValueChange={handleLanguageChange} value={language}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={languageMap[language] || language} />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(languageMap) as LanguageKey[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {languageMap[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mt-4">Toggles</p>
              <div className="p-4">
                <Toggle className="m-2">Global Matches</Toggle>
                <Toggle className="m-2">Capture Groups</Toggle>
                <Toggle className="m-2">Ignore Case</Toggle>
                <Toggle className="m-2">Word Boundaries</Toggle>
              </div>
            </div>
            <Button className="mt-4" onClick={handleGenerateRegex}>Generate Regex</Button>
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[50%]">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>... and get your regex pattern.</CardDescription>
          </CardHeader>
          <CardContent>
            {apiError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong className="font-bold">Error: </strong>
                <span className="inline-block">{apiError}</span>
              </div>
            ) : (
              <>
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div>
                      <p className="my-4">Regex Pattern</p>
                      <Copybox className="h-full font-mono overflow-x-scroll" text={regex_pattern}></Copybox>
                    </div>
                    <div>
                      <p className="my-4">Code Example</p>
                      <Copybox className="h-full font-mono overflow-x-scroll" text={code_example} language={language}></Copybox>
                    </div>
                    {explanation && (
                      <div>
                        <p className="my-4">Explanation</p>
                        <p className="m-4">{explanation}</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
