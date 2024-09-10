import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Declare and initialize these at the top
let incomes: { amount: number; description: string }[] = [];
let expenses: { amount: number; description: string }[] = [];

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL
  methods: ['GET', 'POST'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(bodyParser.json());

// POST route for adding income
app.post('/income', (req: Request, res: Response) => {
  const { amount, description } = req.body;
  incomes.push({ amount, description });
  res.status(201).send({ message: 'Income added!', incomes });
});

// POST route for adding expenses
app.post('/expenses', (req: Request, res: Response) => {
  const { amount, description } = req.body;
  expenses.push({ amount, description });
  res.status(201).send({ message: 'Expense added!', expenses });
});

// GET route for retrieving income
app.get('/income', (req: Request, res: Response) => {
  res.status(200).send(incomes);
});

// GET route for retrieving expenses
app.get('/expenses', (req: Request, res: Response) => {
  res.status(200).send(expenses);
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Backend for StackingSacks is live!');
});

app.listen(PORT, () => {
  console.log(`Server's bumpin' on http://localhost:${PORT}`);
});