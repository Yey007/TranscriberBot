import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { TranscriptionPair } from '../../entity/transcriptionpair';

@Service()
@EntityRepository(TranscriptionPair)
export class TranscriptionPairRepository extends Repository<TranscriptionPair> {}
