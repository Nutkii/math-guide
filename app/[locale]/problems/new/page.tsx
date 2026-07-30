"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FilePlus2, ImagePlus, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MixedText } from "@/components/problem/math-render";

export default function NewProblemPage() {
  const t = useTranslations("problem");
  const [statement, setStatement] = useState(
    "ამოხსენი: $\\sqrt{x + 3} = x - 3$",
  );
  const [solution, setSolution] = useState("");
  const [statementImages, setStatementImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setStatementImages((prev) => [...prev, data.url]);
        toast.success("Image uploaded");
      } else {
        toast.error(data.error ?? "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setStatementImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Submitted for review (mock)");
  };

  return (
    <div className="container max-w-3xl py-12">
      <header className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
          <FilePlus2 className="h-3 w-3" />
          Homework
        </div>
        <h1 className="text-balance font-serif text-3xl font-bold tracking-tight md:text-4xl">
          <span className="text-gradient-cool">{t("uploadTitle")}</span>
        </h1>
        <p className="text-muted-foreground">
          Use LaTeX with <code className="text-primary">$...$</code> for math.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Book</Label>
            <Input placeholder="algebra-9" />
          </div>
          <div className="space-y-2">
            <Label>Problem number</Label>
            <Input placeholder="2.14" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Label>{t("statement")}</Label>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <div className="rule-margin bg-rule-paper relative overflow-hidden rounded-md border border-border">
                  <Textarea
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder={t("writeStatement")}
                    className="min-h-[140px] resize-none rounded-none border-0 bg-transparent pl-14 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <div className="min-h-[140px] rounded-md border border-dashed border-border bg-muted/30 p-4">
                  <MixedText text={statement} />
                </div>
              </TabsContent>
            </Tabs>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              {isUploading ? "Uploading…" : t("uploadImage")}
            </Button>
            {statementImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {statementImages.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt=""
                      className="h-20 w-20 rounded-lg object-cover shadow-sm ring-1 ring-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Label>{t("solution")}</Label>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <div className="rule-margin bg-rule-paper relative overflow-hidden rounded-md border border-border">
                  <Textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder={t("writeSolution")}
                    className="min-h-[200px] resize-none rounded-none border-0 bg-transparent pl-14 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <div className="min-h-[200px] rounded-md border border-dashed border-border bg-muted/30 p-4">
                  {solution ? (
                    <MixedText text={solution} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nothing yet…
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="cool" size="lg">
            <Send className="h-4 w-4" />
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
