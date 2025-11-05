import { Injectable } from "@nestjs/common";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { Label } from "./entities/label.entity";
import { DataSource, EntityManager, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private readonly labelsRepository: Repository<Label>,
    private readonly dataSource: DataSource,
  ) {}

  public async create(createLabelDto: CreateLabelDto): Promise<Label> {
    return this.labelsRepository.save(createLabelDto);
  }

  findAll(): Promise<Label[]> {
    return this.labelsRepository.find();
  }

  findOne(id: string): Promise<Label | null> {
    return this.labelsRepository.findOneBy({ id });
  }

  async findByNames(names: string[]): Promise<Label[]> {
    if (!names?.length) return [];
    return this.labelsRepository.find({ where: { name: In(names) } });
  }

  async update(id: string, updateLabelDto: UpdateLabelDto): Promise<Label> {
    const label = await this.labelsRepository.findOneBy({ id });
    if (!label) {
      throw new Error(`Label with id ${id} not found`);
    }
    Object.assign(label, updateLabelDto);
    return this.labelsRepository.save(label);
  }

  async remove(id: string): Promise<void> {
    await this.labelsRepository.delete(id);
  }

  // Transactional safe get-or-create (Postgres)
  async getOrCreateLabels(names: string[], manager?: EntityManager): Promise<Label[]> {
    if (!names || names.length === 0) return [];

    const repo = manager ? manager.getRepository(Label) : this.labelsRepository;

    // 1. find existing
    const existing = await repo.find({ where: { name: In(names) } });
    const existingNames = new Set(existing.map((l) => l.name));

    // 2. find which names are missing
    const toCreate = names.filter((n) => !existingNames.has(n)).map((n) => ({ name: n }));

    if (toCreate.length) {
      // use query builder upsert (on conflict do nothing) to avoid race conditions
      await repo
        .createQueryBuilder()
        .insert()
        .values(toCreate)
        .onConflict(`("name") DO NOTHING`)
        .execute();
    }

    // 3. fetch again to return full label entities
    return repo.find({ where: { name: In(names) } });
  }
}
