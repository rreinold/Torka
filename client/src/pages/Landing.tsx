import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Target, 
  Brain,
  Image,
  Headphones,
  BarChart,
  CheckCircle,
  Upload,
  Lightbulb,
  User,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6" variant="secondary" data-testid="badge-hero">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Personalized Learning
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Learn Your Way, Not The Highway
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            Torka transforms static textbooks into dynamic, personalized learning experiences with AI-generated media that adapts to how YOU learn best.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/reader">
              <Button size="lg" data-testid="button-start-journey">
                Start Your Adaptive Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" data-testid="button-see-demo">
              See Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6" data-testid="text-value-title">
            Every Learner is Unique. Your Study Materials Should Be Too.
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12" data-testid="text-value-description">
            Traditional textbooks offer one-size-fits-all content, but research shows that people absorb information differently. 
            Torka bridges this gap by enhancing your existing textbooks with personalized multimedia content tailored to your unique learning profile.
          </p>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Whether you're a visual thinker who needs diagrams, an auditory learner who benefits from explanations, or someone who learns through interactive examples, 
            Torka creates the perfect supplementary materials for you.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" data-testid="text-how-it-works">
            Your Personalized Learning Journey in Three Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card data-testid="card-step-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Upload Your Textbook</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Simply upload any textbook or learning material. Torka intelligently analyzes each section and identifies key concepts that could benefit from multimedia enhancement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="card-step-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Experience Enhanced Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  At the end of each section, discover custom-generated content designed just for you – explanatory videos, infographics, audio summaries, and interactive visualizations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="card-step-3">
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Refine Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Complete quick, engaging quizzes after each section. Your responses continuously refine your learning profile, making future content even more aligned with your learning style.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" data-testid="text-features-title">
            Powered by Intelligence, Designed for Understanding
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4" data-testid="feature-adaptive-media">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Adaptive Media Generation</h3>
                <p className="text-muted-foreground">
                  Our AI doesn't just create random content – it analyzes what you're studying and generates the exact type of media that will help concepts click for you.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-learning-profile">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Dynamic Learning Profile</h3>
                <p className="text-muted-foreground">
                  Your profile evolves with every interaction. The more you learn with Torka, the better it understands how to present information in ways that resonate with you.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-integration">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
                <p className="text-muted-foreground">
                  Works with any textbook or PDF. No need to buy new materials – enhance what you already have.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-multi-modal">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Multi-Modal Learning</h3>
                <p className="text-muted-foreground">
                  From animated explanations to podcast-style summaries, from mind maps to interactive simulations – experience content in the format that works best for your brain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" data-testid="text-benefits-title">
            Transform Your Study Sessions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card data-testid="card-benefit-retention">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Boost Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Personalized, multi-modal learning increases retention by up to 60%. Remember more, review less.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="card-benefit-time">
              <CardHeader>
                <Clock className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Save Time</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stop re-reading the same paragraph five times. Get the explanation that clicks the first time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="card-benefit-engagement">
              <CardHeader>
                <Sparkles className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Stay Engaged</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Say goodbye to monotonous reading sessions. Dynamic content keeps you focused and learning enjoyable.
                </CardDescription>
              </CardContent>
            </Card>

            <Card data-testid="card-benefit-progress">
              <CardHeader>
                <BarChart className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your evolving learning profile shows you exactly how you learn best, optimizing all future studies.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-audience-title">
            Built for Modern Learners
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6 text-center">Perfect for:</p>
            <div className="space-y-4">
              {[
                "University students tackling complex subjects",
                "Professional learners pursuing certifications",
                "Self-directed learners exploring new fields",
                'Anyone who\'s ever thought "I wish this was explained differently"'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3" data-testid={`audience-item-${index}`}>
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" data-testid="text-testimonials-title">
            Join Thousands Who've Discovered Their Learning Style
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card data-testid="card-testimonial-1">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Image className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Sarah M.</CardTitle>
                    <CardDescription>Pre-Med Student</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "I'm a visual learner, and Torka's automatic infographics and diagrams made organic chemistry finally make sense. My grades improved by a full letter grade!"
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-testimonial-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">James T.</CardTitle>
                    <CardDescription>MBA Student</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  "The audio summaries are perfect for my commute. I'm actually excited to review material now."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to Learn Smarter, Not Harder?
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="text-cta-description">
            Start with our free trial and experience three enhanced chapters. No credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link href="/reader">
              <Button size="lg" data-testid="button-begin-trial">
                Begin Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" data-testid="button-see-demo-2">
              See Demo
            </Button>
          </div>
          <p className="text-xl font-medium text-primary" data-testid="text-closing-line">
            Your brain is unique. It's time your study materials were too.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-2xl font-semibold mb-2" data-testid="text-footer-tagline">
            Torka: Where Learning Adapts to You.
          </p>
          <p className="text-muted-foreground">
            © 2025 Torka. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
