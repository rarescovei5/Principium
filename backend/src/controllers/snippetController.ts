import express from 'express';
import { CodeSnippet } from '../model/CodeSnippet';
import pool from '../model/db';
import { error } from 'console';

const handleGetPage = async (req: express.Request, res: express.Response) => {};
const handleGetById = async (req: express.Request, res: express.Response) => {
  const q = 'SELECT * FROM `code_snippets` WHERE `id` = ?';
  const id = req.params.id;

  try {
    const [data] = await pool.query(q, [id]);
    const d = data as CodeSnippet[];

    if (d.length === 0) {
      res.sendStatus(404);
      return;
    }

    const codeSnippet = d[0];

    res.status(200).json({
      ...codeSnippet,
      isAuthor: req.user?.id === codeSnippet.user_id,
    });
    return;
  } catch (err) {
    res.status(500).json({ error });
    return;
  }
};
const handleCreate = async (req: express.Request, res: express.Response) => {
  const q =
    'INSERT INTO `code_snippets` (`user_id`, `title`, `description`, `code`, `language`) VALUES (?);';
  const snippet: Partial<CodeSnippet> = req.body;

  if (!req.user?.id) {
    res.status(501).json({ error: 'User not authenticated' });
    return;
  }

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
    req.user.id,
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
const handleModify = async (req: express.Request, res: express.Response) => {
  const q =
    'UPDATE `code_snippets` SET `title` = ?, `description` = ?, `code` = ?, `language` = ? WHERE `id` = ? AND `user_id` = ?';
  const updatedSnippet: Partial<CodeSnippet> = req.body;

  if (!req.user?.id) {
    res.status(501).json({ error: 'User not authenticated' });
    return;
  }

  if (
    !updatedSnippet.title ||
    !updatedSnippet.description ||
    !updatedSnippet.code ||
    !updatedSnippet.language
  ) {
    res.status(500).json({ error: 'Missing required fields.' });
    return;
  }
  const values = [
    updatedSnippet.title,
    updatedSnippet.description,
    updatedSnippet.code,
    updatedSnippet.language,
    req.params.id,
    req.user.id,
  ];

  try {
    await pool.query(q, values);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
const handleDelete = async (req: express.Request, res: express.Response) => {};

export {
  handleCreate,
  handleDelete,
  handleGetPage,
  handleModify,
  handleGetById,
};
