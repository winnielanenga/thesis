"use client";

import { useState } from "react";

// UI primitives
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// Icons
import {
  AlertCircle,
  Bold,
  Italic,
  Underline,
  ChevronDown,
  Info,
  Mail,
  Terminal,
  CalendarDays,
  ChevronsUpDown,
  GraduationCap,
} from "lucide-react";

// ─── TOC sections ────────────────────────────────────────────────
const sections = [
  { id: "typography", label: "Typography" },
  { id: "colors", label: "Colors" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "data-display", label: "Data Display" },
  { id: "feedback", label: "Feedback" },
  { id: "navigation", label: "Navigation" },
  { id: "layout", label: "Layout" },
];

// ─── Color swatch data ──────────────────────────────────────────
const colorTokens = [
  { name: "background", var: "--background", label: "Background" },
  { name: "foreground", var: "--foreground", label: "Foreground" },
  { name: "primary", var: "--primary", label: "Primary" },
  { name: "primary-foreground", var: "--primary-foreground", label: "Primary Fg" },
  { name: "secondary", var: "--secondary", label: "Secondary" },
  { name: "secondary-foreground", var: "--secondary-foreground", label: "Secondary Fg" },
  { name: "muted", var: "--muted", label: "Muted" },
  { name: "muted-foreground", var: "--muted-foreground", label: "Muted Fg" },
  { name: "accent", var: "--accent", label: "Accent" },
  { name: "accent-foreground", var: "--accent-foreground", label: "Accent Fg" },
  { name: "destructive", var: "--destructive", label: "Destructive" },
  { name: "border", var: "--border", label: "Border" },
  { name: "ring", var: "--ring", label: "Ring" },
  { name: "gold", var: "--gold", label: "Gold" },
];

// ─── Section wrapper ─────────────────────────────────────────────
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight border-b border-border pb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
export default function PrimitivesPage() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("option-1");
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-md bg-card/80">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">
                <span className="font-serif">ThesisPrep</span>
                <span className="text-muted-foreground font-normal mx-2">/</span>
                <span className="font-serif">Primitives</span>
              </h1>
            </div>
            <Badge variant="outline">v3.0</Badge>
          </div>
        </header>

        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar TOC */}
          <nav className="hidden lg:block w-56 shrink-0 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto border-r py-8 px-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              On this page
            </p>
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content */}
          <main className="flex-1 min-w-0 px-6 lg:px-12 py-10 space-y-16">
            {/* Intro */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight font-serif">
                Design Primitives
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A comprehensive reference of every component, color, and
                typographic style available in ThesisPrep. Built on shadcn/ui,
                Radix, and Tailwind CSS.
              </p>
            </div>

            {/* ─── TYPOGRAPHY ─────────────────────────────────── */}
            <Section id="typography" title="Typography">
              <SubSection title="Heading Scale (Serif)">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-sans">h1 &middot; text-4xl &middot; font-bold</p>
                    <h1 className="text-4xl font-bold tracking-tight font-serif">The quick brown fox jumps</h1>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-sans">h2 &middot; text-3xl &middot; font-bold</p>
                    <h2 className="text-3xl font-bold tracking-tight font-serif">The quick brown fox jumps</h2>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-sans">h3 &middot; text-2xl &middot; font-semibold</p>
                    <h3 className="text-2xl font-semibold font-serif">The quick brown fox jumps</h3>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-sans">h4 &middot; text-xl &middot; font-semibold</p>
                    <h4 className="text-xl font-semibold font-serif">The quick brown fox jumps</h4>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-sans">h5 &middot; text-lg &middot; font-medium</p>
                    <h5 className="text-lg font-medium font-serif">The quick brown fox jumps</h5>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-sans">h6 &middot; text-base &middot; font-medium</p>
                    <h6 className="text-base font-medium font-serif">The quick brown fox jumps</h6>
                  </div>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Body Text (Sans-Serif)">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">text-lg</p>
                    <p className="text-lg">
                      ThesisPrep helps high school students plan their academic journey from freshman year through graduation and college admissions.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">text-base (default)</p>
                    <p className="text-base">
                      ThesisPrep helps high school students plan their academic journey from freshman year through graduation and college admissions.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">text-sm</p>
                    <p className="text-sm">
                      ThesisPrep helps high school students plan their academic journey from freshman year through graduation and college admissions.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">text-xs</p>
                    <p className="text-xs">
                      ThesisPrep helps high school students plan their academic journey from freshman year through graduation and college admissions.
                    </p>
                  </div>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Font Weights">
                <div className="space-y-2">
                  {([
                    ["font-normal (400)", "font-normal"],
                    ["font-medium (500)", "font-medium"],
                    ["font-semibold (600)", "font-semibold"],
                    ["font-bold (700)", "font-bold"],
                    ["font-extrabold (800)", "font-extrabold"],
                  ] as const).map(([label, cls]) => (
                    <div key={label} className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground w-40 shrink-0">{label}</span>
                      <span className={`${cls} text-lg font-serif`}>Plan Your Future.</span>
                    </div>
                  ))}
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Serif vs Sans Comparison">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>EB Garamond (Serif)</CardTitle>
                      <CardDescription>Headings & body copy</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-serif text-lg leading-relaxed">
                        Education is the most powerful weapon which you can use to change the world. The roots of education are bitter, but the fruit is sweet.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-sans">Inter (Sans-Serif)</CardTitle>
                      <CardDescription>UI controls & labels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-sans text-lg leading-relaxed">
                        Education is the most powerful weapon which you can use to change the world. The roots of education are bitter, but the fruit is sweet.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </SubSection>
            </Section>

            {/* ─── COLORS ─────────────────────────────────────── */}
            <Section id="colors" title="Colors">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {colorTokens.map((token) => (
                  <div key={token.name} className="space-y-2">
                    <div
                      className="h-20 rounded-lg border shadow-sm"
                      style={{ backgroundColor: `var(${token.var})` }}
                    />
                    <div>
                      <p className="text-sm font-medium">{token.label}</p>
                      <p className="text-xs text-muted-foreground font-mono">{token.var}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <SubSection title="Gradient Examples">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="h-20 rounded-lg bg-gradient-to-r from-primary to-gold flex items-center justify-center text-white font-bold font-serif text-lg">
                    Primary to Gold
                  </div>
                  <div className="h-20 rounded-lg bg-gradient-to-r from-secondary to-muted flex items-center justify-center text-foreground font-bold font-serif text-lg">
                    Secondary to Muted
                  </div>
                  <div className="h-20 rounded-lg bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center text-white font-bold font-serif text-lg">
                    Primary Fade
                  </div>
                </div>
              </SubSection>
            </Section>

            {/* ─── BUTTONS ────────────────────────────────────── */}
            <Section id="buttons" title="Buttons">
              <SubSection title="Variants">
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </SubSection>

              <SubSection title="Sizes">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Mail className="h-4 w-4" /></Button>
                </div>
              </SubSection>

              <SubSection title="States">
                <div className="flex flex-wrap gap-3">
                  <Button>Enabled</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </SubSection>

              <SubSection title="With Icons">
                <div className="flex flex-wrap gap-3">
                  <Button><Mail className="h-4 w-4 mr-2" /> Login with Email</Button>
                  <Button variant="outline"><GraduationCap className="h-4 w-4 mr-2" /> View Roadmap</Button>
                  <Button variant="secondary"><CalendarDays className="h-4 w-4 mr-2" /> Schedule</Button>
                </div>
              </SubSection>
            </Section>

            {/* ─── FORMS ──────────────────────────────────────── */}
            <Section id="forms" title="Forms">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <SubSection title="Input">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="student@school.edu" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="disabled-input">Disabled</Label>
                      <Input id="disabled-input" disabled placeholder="Disabled input" />
                    </div>
                  </SubSection>

                  <SubSection title="Textarea">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Personal Statement</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself..." />
                    </div>
                  </SubSection>

                  <SubSection title="Select">
                    <div className="space-y-2">
                      <Label>Grade Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">9th Grade (Freshman)</SelectItem>
                          <SelectItem value="10">10th Grade (Sophomore)</SelectItem>
                          <SelectItem value="11">11th Grade (Junior)</SelectItem>
                          <SelectItem value="12">12th Grade (Senior)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </SubSection>
                </div>

                <div className="space-y-6">
                  <SubSection title="Checkbox">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">Accept terms and conditions</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" defaultChecked />
                        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="disabled-check" disabled />
                        <Label htmlFor="disabled-check" className="text-muted-foreground">Disabled</Label>
                      </div>
                    </div>
                  </SubSection>

                  <SubSection title="Switch">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Enable notifications</Label>
                        <Switch
                          id="notifications"
                          checked={switchChecked}
                          onCheckedChange={setSwitchChecked}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="disabled-switch" className="text-muted-foreground">Disabled</Label>
                        <Switch id="disabled-switch" disabled />
                      </div>
                    </div>
                  </SubSection>

                  <SubSection title="Radio Group">
                    <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-1" id="r1" />
                        <Label htmlFor="r1">STEM Track</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-2" id="r2" />
                        <Label htmlFor="r2">Humanities Track</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-3" id="r3" />
                        <Label htmlFor="r3">Arts Track</Label>
                      </div>
                    </RadioGroup>
                  </SubSection>

                  <SubSection title="Slider">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label>Target GPA</Label>
                        <span className="text-sm text-muted-foreground">
                          {(sliderValue[0] / 12.5).toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={50}
                        step={1}
                      />
                    </div>
                  </SubSection>
                </div>
              </div>
            </Section>

            {/* ─── DATA DISPLAY ───────────────────────────────── */}
            <Section id="data-display" title="Data Display">
              <SubSection title="Card">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>GPA Tracker</CardTitle>
                      <CardDescription>Track your academic performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">3.85</p>
                      <p className="text-sm text-muted-foreground">Weighted GPA</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Glass Card</CardTitle>
                      <CardDescription>Uses the glass-card utility</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Semi-transparent with backdrop blur for layered surfaces.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    <CardHeader>
                      <CardTitle className="text-primary-foreground">Featured</CardTitle>
                      <CardDescription className="text-primary-foreground/70">Highlighted card variant</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">12</p>
                      <p className="text-sm text-primary-foreground/70">Milestones this semester</p>
                    </CardContent>
                  </Card>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Badge">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Avatar">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>WL</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>TP</AvatarFallback>
                  </Avatar>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Table">
                <Card>
                  <Table>
                    <TableCaption>Fall semester course schedule</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead className="text-right">Credits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">AP English Literature</TableCell>
                        <TableCell><Badge variant="outline">AP</Badge></TableCell>
                        <TableCell>A</TableCell>
                        <TableCell className="text-right">1.0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Calculus BC</TableCell>
                        <TableCell><Badge variant="outline">AP</Badge></TableCell>
                        <TableCell>A-</TableCell>
                        <TableCell className="text-right">1.0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">US History</TableCell>
                        <TableCell><Badge variant="secondary">Honors</Badge></TableCell>
                        <TableCell>B+</TableCell>
                        <TableCell className="text-right">1.0</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Physics</TableCell>
                        <TableCell><Badge variant="secondary">Regular</Badge></TableCell>
                        <TableCell>A</TableCell>
                        <TableCell className="text-right">1.0</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              </SubSection>

              <Separator />

              <SubSection title="Progress">
                <div className="space-y-4 max-w-md">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Milestones completed</span>
                      <span className="text-muted-foreground">25%</span>
                    </div>
                    <Progress value={25} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>College apps progress</span>
                      <span className="text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Study goal for the week</span>
                      <span className="text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} />
                  </div>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Skeleton">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Separator">
                <div className="space-y-4 max-w-sm">
                  <div>
                    <p className="text-sm font-medium">Horizontal</p>
                    <Separator className="my-2" />
                    <p className="text-sm text-muted-foreground">Content below separator</p>
                  </div>
                  <div className="flex items-center gap-4 h-8">
                    <span className="text-sm">Dashboard</span>
                    <Separator orientation="vertical" />
                    <span className="text-sm">Planner</span>
                    <Separator orientation="vertical" />
                    <span className="text-sm">Settings</span>
                  </div>
                </div>
              </SubSection>
            </Section>

            {/* ─── FEEDBACK ───────────────────────────────────── */}
            <Section id="feedback" title="Feedback">
              <SubSection title="Alert">
                <div className="space-y-4 max-w-lg">
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      Your SAT registration deadline is in 2 weeks.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to save your progress. Please try again.
                    </AlertDescription>
                  </Alert>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Dialog">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Course</DialogTitle>
                      <DialogDescription>
                        Make changes to your course details here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="course-name">Course name</Label>
                        <Input id="course-name" defaultValue="AP English Literature" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course-teacher">Teacher</Label>
                        <Input id="course-teacher" defaultValue="Mrs. Johnson" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </SubSection>

              <Separator />

              <SubSection title="Alert Dialog">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SubSection>

              <Separator />

              <SubSection title="Toast">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => toast.success("Milestone completed!")}
                  >
                    Success Toast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.error("Failed to save changes.")}
                  >
                    Error Toast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.info("SAT registration opens next week.")}
                  >
                    Info Toast
                  </Button>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Tooltip">
                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View more information</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a tooltip</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Hover Card">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">@thesisprep</Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>TP</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">ThesisPrep</h4>
                        <p className="text-sm text-muted-foreground">
                          The all-in-one workspace for high school success.
                        </p>
                        <div className="flex items-center pt-2">
                          <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                          <span className="text-xs text-muted-foreground">
                            Joined March 2025
                          </span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </SubSection>
            </Section>

            {/* ─── NAVIGATION ─────────────────────────────────── */}
            <Section id="navigation" title="Navigation">
              <SubSection title="Tabs">
                <Tabs defaultValue="overview" className="max-w-lg">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="exams">Exams</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="p-4 text-sm">
                    Your academic overview and key metrics.
                  </TabsContent>
                  <TabsContent value="courses" className="p-4 text-sm">
                    Course schedule and grade tracker.
                  </TabsContent>
                  <TabsContent value="exams" className="p-4 text-sm">
                    Upcoming exams and preparation status.
                  </TabsContent>
                </Tabs>
              </SubSection>

              <Separator />

              <SubSection title="Breadcrumb">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Academics</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>AP English Literature</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </SubSection>

              <Separator />

              <SubSection title="Pagination">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </SubSection>

              <Separator />

              <SubSection title="Dropdown Menu">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Planner</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SubSection>
            </Section>

            {/* ─── LAYOUT ─────────────────────────────────────── */}
            <Section id="layout" title="Layout">
              <SubSection title="Sheet">
                <div className="flex gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open Sheet (Right)</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Sheet Title</SheetTitle>
                        <SheetDescription>
                          This is a sheet component sliding in from the right.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        <p className="text-sm text-muted-foreground">Sheet body content goes here.</p>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open Sheet (Left)</Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Navigation</SheetTitle>
                        <SheetDescription>
                          Mobile navigation panel.
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </div>
              </SubSection>

              <Separator />

              <SubSection title="Popover">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Quick Settings</h4>
                      <p className="text-sm text-muted-foreground">
                        Adjust your preferences here.
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <Label htmlFor="popover-switch">Dark mode</Label>
                        <Switch id="popover-switch" />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </SubSection>

              <Separator />

              <SubSection title="Accordion">
                <Accordion type="single" collapsible className="max-w-lg">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is ThesisPrep?</AccordionTrigger>
                    <AccordionContent>
                      ThesisPrep is an all-in-one workspace for high school students to plan their academic journey, track grades, and prepare for college admissions.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How does the roadmap work?</AccordionTrigger>
                    <AccordionContent>
                      Based on your career path and graduation year, we generate a personalized 4-year milestone roadmap with season-by-season tasks.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Can I change my career path later?</AccordionTrigger>
                    <AccordionContent>
                      Yes! You can update your career path anytime in Settings. Your roadmap will regenerate automatically.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SubSection>

              <Separator />

              <SubSection title="Collapsible">
                <Collapsible
                  open={collapsibleOpen}
                  onOpenChange={setCollapsibleOpen}
                  className="max-w-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">
                      3 pinned milestones
                    </h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div className="rounded-md border px-4 py-2 text-sm">
                    Register for SAT
                  </div>
                  <CollapsibleContent className="space-y-2">
                    <div className="rounded-md border px-4 py-2 text-sm">
                      Request teacher recommendations
                    </div>
                    <div className="rounded-md border px-4 py-2 text-sm">
                      Submit Common App essay draft
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </SubSection>

              <Separator />

              <SubSection title="Scroll Area">
                <ScrollArea className="h-48 w-full max-w-sm rounded-md border p-4">
                  <div className="space-y-4">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-medium">Milestone {i + 1}</p>
                        <p className="text-muted-foreground text-xs">
                          Complete this task by end of semester
                        </p>
                        {i < 19 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SubSection>

              <Separator />

              <SubSection title="Toggle">
                <div className="flex gap-3">
                  <Toggle aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle underline">
                    <Underline className="h-4 w-4" />
                  </Toggle>
                </div>
              </SubSection>

              <SubSection title="Toggle Group">
                <ToggleGroup type="multiple">
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Toggle underline">
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </SubSection>
            </Section>

            {/* Footer */}
            <Separator />
            <footer className="text-center text-sm text-muted-foreground pb-8">
              <p>ThesisPrep Primitives &middot; Built with shadcn/ui, Radix, and Tailwind CSS</p>
            </footer>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
