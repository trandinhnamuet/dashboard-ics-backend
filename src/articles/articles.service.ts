import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './articles.entity';
import { CreateArticleDto, UpdateArticleDto } from './articles.controller';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim() // Remove leading/trailing whitespace
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const { title, excerpt, content, thumbnail_url, author_id, status = 'draft' } = createArticleDto;
    
    let slug = this.generateSlug(title);
    
    // Ensure slug is unique
    let counter = 1;
    const baseSlug = slug;
    while (await this.articleRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const article = this.articleRepository.create({
      title,
      slug,
      excerpt,
      content,
      thumbnail_url,
      author_id,
      status,
    });

    return await this.articleRepository.save(article);
  }

  async getArticleById(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async getAllArticles(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ data: Article[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');
    
    if (status) {
      queryBuilder.where('article.status = :status', { status });
    }
    
    const [data, total] = await queryBuilder
      .orderBy('article.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async updateArticle(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.getArticleById(id);
    
    if (updateArticleDto.title && updateArticleDto.title !== article.title) {
      let slug = this.generateSlug(updateArticleDto.title);
      
      // Ensure slug is unique (excluding current article)
      let counter = 1;
      const baseSlug = slug;
      while (await this.articleRepository.findOne({ 
        where: { slug },
        // Exclude current article from uniqueness check
      })) {
        const existingArticle = await this.articleRepository.findOne({ where: { slug } });
        if (existingArticle && existingArticle.id !== id) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        } else {
          break;
        }
      }
      
      article.slug = slug;
    }

    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async deleteArticle(id: string): Promise<void> {
    const article = await this.getArticleById(id);
    await this.articleRepository.delete(id);
  }
}