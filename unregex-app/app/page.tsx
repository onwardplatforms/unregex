"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Copybox } from '@/components/ui/copybox'
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
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [language, setLanguage] = useState("python");
  const [textCount, setTextCount] = useState(0);
  const [regex_pattern, setRegexPattern] = useState("");
  const [code_example, setCodeExample] = useState("");
  const [apiError, setApiError] = useState(null);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setTextCount(e.target.value.length);
  };

  const handleGenerateRegex = async () => {
    setApiError(null);
    const prompt = `
      Given this text:
      \`${text}\`
    
      I want to write valid regex for the programming language "${language}" given this context:
      \`${context}\`
    
      Return the response as a json object that looks like this:
    
      {
        "regex_pattern": "The regex pattern",
        "code_example": "A code example that includes all required imports and logic",
      }
    
      ONLY return json.  Make sure escape all characters in the response so it is valid.  DO NOT explain.  When writing regex, try to use patterns that are more flexible rather than rigid.
    `;

    console.log(prompt)

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are an expert at writing regex and love helping people write great regex."
          },
          {
            "role": "user",
            "content": prompt
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const chatOutput = response.data.choices[0].message.content;
      const regexOutput = JSON.parse(chatOutput);

      console.log(regexOutput)

      setRegexPattern(regexOutput.regex_pattern);
      setCodeExample(regexOutput.code_example);

    } catch (error: any) {
      console.error('Error interacting with OpenAI API: ', error);
      setApiError(error.toString());
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-between p-24">
      <div className="flex flex-col lg:items-stretch lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Define what you want to extract ...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="my-4">Text</p>
            <Textarea value={text} onChange={handleTextChange} maxLength={1000} />
            <div className="text-right mt-1 text-sm text-gray-500">{textCount}/1000</div>
            <p className="my-4">Context</p>
            <Input className="my-4" type="text" placeholder="I want to extract..." value={context} onChange={(e) => setContext(e.target.value)} />
            <p className="my-4">Language</p>
            <Select onValueChange={handleLanguageChange} value={language}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder={language} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="dotnetcsharp">.Net (C#)</SelectItem>
                <SelectItem value="java8">Java8</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
              </SelectContent>
            </Select>
            <Button className="mt-4" onClick={handleGenerateRegex}>Generate Regex</Button>
          </CardContent>
        </Card>
        <Card className="w-full">
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
              <p className="my-4">Regex Pattern</p>
              <Copybox className="h-full" text={regex_pattern}></Copybox>
              <p className="mt-4">Code Example</p>
              <Copybox className="h-full" text={code_example}></Copybox>
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </main>
  )
}
