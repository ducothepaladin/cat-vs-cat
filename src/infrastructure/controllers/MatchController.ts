
// import { Request, Response } from 'express';
// import { MatchRepository } from '../../infrastructure/repositories/MatchRepository';
// import { StartMatch } from '../../usecases/match/StartMatch';

// export const createMatch = async (req: Request, res: Response) => {
//     const { p1, p2 } = req.body;

//     try {
//         const usecase = new StartMatch(new MatchRepository());
//         const result = await usecase.execute({p1, p2});

//         res.status(201).json({
//             message: "Match Created",
//             content: {
//                 match_id: result.matchId
//             }
//         })
//     } catch(err) {
//         res.status(500).json({error: err});
//     }
// }