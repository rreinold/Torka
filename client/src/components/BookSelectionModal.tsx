import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { books } from "@/lib/books";
import { BookOpen, TrendingUp, Zap } from "lucide-react";

interface BookSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBook: (bookId: string) => void;
}

export function BookSelectionModal({ open, onOpenChange, onSelectBook }: BookSelectionModalProps) {
  const bookList = Object.values(books);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Book</DialogTitle>
          <DialogDescription>
            Select a book to start your adaptive learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {bookList.map((book) => (
            <Card
              key={book.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onSelectBook(book.id)}
              data-testid={`book-card-${book.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{book.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {book.sections.length} sections
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ml-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Interactive quizzes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Adaptive learning</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBook(book.id);
                  }}
                  data-testid={`button-select-${book.id}`}
                >
                  Start Reading
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
