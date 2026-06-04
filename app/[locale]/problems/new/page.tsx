"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Send, X } from "lucide-react";
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">{t("uploadTitle")}</h1>
        <p className="mt-2 text-muted-foreground">
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
                <Textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder={t("writeStatement")}
                  className="min-h-[140px] font-mono text-sm"
                />
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
                      className="h-20 w-20 rounded border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white"
                    >
                      <X className="h-2.5 w-2.5" />
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
                <Textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder={t("writeSolution")}
                  className="min-h-[200px] font-mono text-sm"
                />
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
