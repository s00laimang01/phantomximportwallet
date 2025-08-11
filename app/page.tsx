"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

const Page = () => {
  const [recoveryPhrase, setRecoveryPhrase] = useState("");

  const [is24WordPhrase, setIs24WordPhrase] = useState(false);
const [isValid, setIsValid] = useState(false);

  const detectPaste = async () => {
    try {
      const rp = await navigator.clipboard.readText();
      
      // Verify recovery phrase is correct
      const words = rp.trim().split(/\s+/);
      const isValidLength = words.length === 12 || words.length === 24;
      
      if (isValidLength) {
        setRecoveryPhrase(rp);
        setIs24WordPhrase(words.length === 24);
        setIsValid(true);
      } else {
        alert("Please paste a valid 12 or 24-word recovery phrase");
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      alert("Failed to access clipboard. Please try again.");
    }
  };

  return (
    <div>
      <header className="p-5 flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <ArrowLeft size={25} className="text-foreground/60" />
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "size-4 bg-secondary rounded-full",
                idx === 0 && "bg-primary"
              )}
            />
          ))}
        </div>
        <Button onClick={detectPaste} variant="link">
          Paste
        </Button>
      </header>
      <Separator />
      <div className="p-3 space-y-6">
        <h2 className="text-4xl font-bold text-center">
          Secret Recovery Phrase
        </h2>

        <p className="text-xl text-muted-foreground text-center">
          Import an existing wallet with your 12 or 24-word secret recovery
          phrase
        </p>

        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: is24WordPhrase ? 24 : 12 }).map((_, idx) => {
            const words = recoveryPhrase.split(/\s+/);
            const phrase = words[idx] || "";

            return (
              <div key={idx} className="relative w-full">
                <p className="absolute left-3 top-1.5 text-muted-foreground">
                  {idx + 1}.
                </p>
                <Input
                  value={phrase}
                  onChange={(e) => {
                    const newWords = [...words];
                    newWords[idx] = e.target.value.trim();
                    setRecoveryPhrase(newWords.join(" "));
                  }}
                  className="pl-7 font-medium"
                />
              </div>
            );
          })}
        </div>

        <footer className="space-y-2">
          <p 
            className="text-center text-muted-foreground font-medium cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              setIs24WordPhrase(!is24WordPhrase);
              setRecoveryPhrase("");
              setIsValid(false);
            }}
          >
            I have a {is24WordPhrase ? "12" : "24"}-word recovery phrase
          </p>
          <Button 
            className="w-full h-[3rem] cursor-pointer" 
            disabled={!isValid}
            onClick={() => {
              const words = recoveryPhrase.trim().split(/\s+/);
              const expectedLength = is24WordPhrase ? 24 : 12;
              
              if (words.length === expectedLength && words.every(word => word.trim() !== "")) {
                alert("Wallet imported successfully!");
              } else {
                alert(`Please enter all ${expectedLength} words of your recovery phrase`);
              }
            }}
          >
            Import Wallet
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Page;
