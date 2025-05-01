import express from 'express';
import { CodeSnippet } from '../model/CodeSnippet';
import pool from '../model/db';

const handleGetPage = async (req: express.Request, res: express.Response) => {
  // Get Filters
  const languageFilter = req.query.language as string | undefined;
  const titleFilter = req.query.title as string | undefined;

  // Base queries
  let countQuery = 'SELECT COUNT(*) AS total FROM `code_snippets`';
  let dataQuery = 'SELECT * FROM `code_snippets`';
  const queryParams: any[] = [];

  // Add Filters
  const whereClauses: string[] = [];
  if (languageFilter) {
    whereClauses.push('`language` = ?');
    queryParams.push(languageFilter);
  }
  if (titleFilter) {
    whereClauses.push('`title` LIKE ?');
    queryParams.push(`%${titleFilter}%`);
  }
  if (whereClauses.length > 0) {
    const whereSQL = ' WHERE ' + whereClauses.join(' AND ');
    countQuery += whereSQL;
    dataQuery += whereSQL;
  }

  // Pagination defaults
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 12;

  const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
  const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

  const offset = (page - 1) * limit;

  // Add LIMIT and OFFSET to data query
  dataQuery += ' LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  try {
    const [countResult] = await pool.query(
      countQuery,
      queryParams.slice(0, queryParams.length - 2)
    );
    const totalRecords = (countResult as any)[0].total;

    // Execute data query
    const [data] = await pool.query(dataQuery, queryParams);

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
