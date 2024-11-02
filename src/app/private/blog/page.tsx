"use client";

import Head from "@/app/components/Head/Head";
import HelpSalary from "../help-salary/HelpSalary";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Blog() {
  return (
    <>
      <Head />
      <div className="text-center">
        <h1>Welcome to blog</h1>
        <h2 className="text-purple-500 font-medium text-2xl">
          Here you find tips
        </h2>
      </div>
      <section className="grid place-items-center py-10">
        <Accordion type="single" collapsible className="w-3/4">
          <AccordionItem value="1">
            <AccordionTrigger>
              You want tip for how divide salary with ley 50-30-20?
            </AccordionTrigger>
            <AccordionContent>
              <HelpSalary />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </>
  );
}
