"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Send } from "lucide-react";
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
            <Button type="button" variant="outline" size="sm" className="mt-3">
              <ImagePlus className="h-4 w-4" />
              {t("uploadImage")}
            </Button>
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
