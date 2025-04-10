import express from 'express';
import { CodeSnippet } from '../model/CodeSnippet';
import pool from '../model/db';
import { error } from 'console';

const handleGetPage = async (req: express.Request, res: express.Response) => {
  //Queries
  const countQuery = 'SELECT COUNT(*) AS total FROM `code_snippets`';
  const dataQuery = 'SELECT * FROM `code_snippets` LIMIT ? OFFSET ?';

  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 12;

  const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
  const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

  const offset = (page - 1) * limit;

  try {
    const [countResult] = await pool.query(countQuery);
    const totalRecords = (countResult as any)[0].total;

    const [data] = await pool.query(dataQuery, [limit, offset]);

    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      totalRecords,
      totalPages,
      currentPage: page,
      records: data,
    });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
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
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
const handleCreate = async (req: express.Request, res: express.Response) => {
  const q =
    'INSERT INTO `code_snippets` (`user_id`, `title`, `description`, `code`, `language`) VALUES (?);';
  const snippet: Partial<CodeSnippet> = req.body;

  if (!req.user?.id) {
    res.status(401).json({ error: 'User not authenticated.' });
    return;
  }

  if (
    !snippet.title ||
    !snippet.description ||
    !snippet.code ||
    !snippet.language
  ) {
    res.status(400).json({ error: 'Missing required fields.' });
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
    res.status(200).json({ message: 'Snippet created successfully.' });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const handleModify = async (req: express.Request, res: express.Response) => {
  const q =
    'UPDATE `code_snippets` SET `title` = ?, `description` = ?, `code` = ?, `language` = ? WHERE `id` = ? AND `user_id` = ?';
  const updatedSnippet: Partial<CodeSnippet> = req.body;

  if (!req.user?.id) {
    res.status(401).json({ error: 'User not authenticated.' });
    return;
  } else if (
    !updatedSnippet.title ||
    !updatedSnippet.description ||
    !updatedSnippet.code ||
    !updatedSnippet.language
  ) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    const values = [
      updatedSnippet.title,
      updatedSnippet.description,
      updatedSnippet.code,
      updatedSnippet.language,
      req.params.id,
      req.user.id,
    ];
    await pool.query(q, values);
    res.status(200).json({ message: 'Snippet modified successfully.' });
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
};
const handleDelete = async (req: express.Request, res: express.Response) => {
  const q = 'DELETE FROM `code_snippets` WHERE `id` = ? AND `user_id` = ?';
  if (!req.user?.id) {
    res.status(401).json({ error: 'User not authenticated.' });
    return;
  }
  try {
    const values = [req.params.id, req.user.id];
    await pool.query(q, values);
    res.status(200).json({ message: 'Snippet deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export {
  handleCreate,
  handleDelete,
  handleGetPage,
  handleModify,
  handleGetById,
};
