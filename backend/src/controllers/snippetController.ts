import express from 'express';
import { CodeSnippet } from '../model/CodeSnippets';
import pool from '../model/db';

const handleGetPage = async (req: express.Request, res: express.Response) => {};
const handleGetById = async (req: express.Request, res: express.Response) => {};
const handleCreate = async (req: express.Request, res: express.Response) => {
  const q =
    'INSERT INTO `code_snippets` (`user_id`, `title`, `description`, `code`, `language`) VALUES (?);';
  const snippet: Partial<CodeSnippet> = req.body;

  if (
    !snippet.title ||
    !snippet.description ||
    !snippet.code ||
    !snippet.language
  ) {
    res.status(500).json({ error: 'Missing required fields.' });
    return;
  }

  const values = [
    req.body.user_id,
    snippet.title,
    snippet.description,
    snippet.code,
    snippet.language,
  ];

  try {
    await pool.query(q, [values]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error });
  }
};
const handleModify = async (req: express.Request, res: express.Response) => {};
const handleDelete = async (req: express.Request, res: express.Response) => {};

export {
  handleCreate,
  handleDelete,
  handleGetPage,
  handleModify,
  handleGetById,
};
