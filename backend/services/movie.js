
import { InvalidArgumentException } from "../exceptions/invalid_argument_exception.js";
import { getDependency } from "../libs/dependencies.js";

export class MovieService {
  static async get(filter) {
    const MovieModel = getDependency('MovieModel');
    return await MovieModel.find(filter);
  }

  static async create(movie) {
    if (!movie.title) {
      throw new InvalidArgumentException('Falta el parámetro title.');
    }

    const MovieModel = getDependency('MovieModel');
    const newMovie = new MovieModel(movie);
    await newMovie.save();
    return newMovie;
  }

  static async deleteById(id) {
    if (!id) {
      throw new InvalidArgumentException('Falta el parámetro id.');
    }

    const MovieModel = getDependency('MovieModel');
    const movie = await MovieModel.findByIdAndDelete(id);
    if (!movie) {
      throw new InvalidArgumentException('Película no encontrada.');
    }
  }

  static async updateById(id, data) {
    if (!id) {
      throw new InvalidArgumentException('Falta el parámetro id.');
    }

    const MovieModel = getDependency('MovieModel');
    const movie = await MovieModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!movie) {
      throw new InvalidArgumentException('Película no encontrada.');
    }
    return movie;
  }
}
