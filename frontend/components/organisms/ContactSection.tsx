"use client";

import { useState } from "react";
import SectionLabel from "@/components/atoms/SectionLabel";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Icon from "@/components/atoms/Icon";
import SocialLinks from "@/components/molecules/SocialLinks";
import ContactInfoRow from "@/components/molecules/ContactInfoRow";
import { ContactInfo, SocialLink } from "@/types";

const socialLinks: SocialLink[] = [
  { icon: "Github", href: "https://github.com", label: "GitHub" },
  { icon: "Linkedin", href: "https://linkedin.com", label: "LinkedIn" },
  { icon: "Twitter", href: "https://twitter.com", label: "Twitter" },
  { icon: "Mail", href: "mailto:rao.jatin15@live.com", label: "Email" },
];

const contactInfo: ContactInfo[] = [
  { icon: "Mail", label: "Email", value: "rao.jatin15@live.com" },
  { icon: "MapPin", label: "Location", value: "Gurugram, India" },
];

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
  };

  return (
    <div id="contact" className="bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-24">
        <SectionLabel>What&apos;s Next?</SectionLabel>

        <div className="grid grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[48px] font-black tracking-[-1.5px] text-[#1a1a1a] leading-[1.1]">
              Let&apos;s{" "}
              <span className="text-[#2d5a3d] border-b-4 border-[#c9a84c]">
                Work
              </span>
              <br />
              Together
            </h2>

            <p className="text-base text-[#6b6b5e] leading-[1.7] border-l-[3px] border-[#c9a84c] pl-4">
              Although I&apos;m not currently looking for any new opportunities,
              my inbox is always open. Whether you have a question, a project
              idea, or just want to say hi — I&apos;ll try my best to get back
              to you!
            </p>

            <div className="flex gap-4 items-center">
              <Button variant="primary" className="px-7 py-[14px] text-[15px]">
                <Icon name="Mail" size={16} color="#fff" />
                Say Hello
              </Button>
            </div>

            <div>
              <p className="text-[13px] text-[#6b6b5e] font-semibold uppercase tracking-[1px] mb-3">
                Connect with me
              </p>
              <SocialLinks links={socialLinks} />
            </div>

            <div>
              {contactInfo.map((info) => (
                <ContactInfoRow key={info.label} {...info} />
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="flex flex-col gap-5 bg-white border border-[#c9a84c] border-t-4 border-t-[#2d5a3d] rounded-[6px] p-8">
            <h3 className="text-[20px] font-bold text-[#1a1a1a] border-l-4 border-[#c9a84c] pl-3">
              Send a Message
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <Input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
            />

            <Textarea
              name="message"
              placeholder="Your message here..."
              value={form.message}
              onChange={handleChange}
            />

            <Button
              variant="primary"
              className="w-full py-[14px]"
              onClick={handleSubmit}
            >
              <Icon name="Send" size={16} color="#fff" />
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}