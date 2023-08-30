"use client"

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
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
  const [language, setLanguage] = useState("");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleGenerateRegex = () => {
    const prompt = `
      Given this text:
      \`${text}\`

      I want to write valid regex for the programming language ${language} given this context:
      \`${context}\`

      Return the response as a json object that looks like this:

      {
        "regex_pattern": "The regex pattern",
        "code_example": "A code example",
      }

      ONLY return json.  DO NOT explain.  When writing regex, try to use patterns that are more flexible rather than ridged.
    `;

    console.log(prompt);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Card>
          <CardHeader>
            <CardTitle>Unregex</CardTitle>
            <CardDescription>The best way to make writing Regex unsuck.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="my-4">Text</p>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} />
            <p className="my-4">Context</p>
            <Input className="my-4" type="text" placeholder="I want to extract..." value={context} onChange={(e) => setContext(e.target.value)} />
            <p className="my-4">Language</p>
            <Select onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Language" />
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
            <Button className="my-4" onClick={handleGenerateRegex}>Generate Regex</Button>
          </CardContent>
          <CardFooter>
            Created by Justin O'Connor
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
