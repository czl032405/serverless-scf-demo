import * as mongoose from "mongoose";
import { DocumentType, ReturnModelType, getModelForClass } from "@typegoose/typegoose";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";

abstract class BaseService<U extends AnyParamConstructor<T>, T = any> {
  protected abstract Model: ReturnModelType<U, unknown>;

  // async all() {
  //     let result = await this.Model.find({});
  //     return result;
  // }

  async index(pageNo = 1, pageSize = 20, q = "", cond: any = {}, sort = "", select = "", populate: string | any = "") {
    pageNo = +pageNo;
    pageSize = +pageSize;
    let begin = (pageNo - 1) * pageSize;
    let $or = [];

    let ins = new this.Model();

    let schema = ins.schema;

    if (!schema.path("companyId")) {
      delete cond.companyId;
    }

    if (q) {
      if (mongoose.Types.ObjectId.isValid(q) && /[a-z0-9]{24}/.test(q)) {
        cond = { _id: q };
      } else {
        let reg = new RegExp(q, "i");

        if (q.toLowerCase() == "active") {
          reg = new RegExp(`^${q}$`, "i");
        }

        schema.eachPath(function(path, type) {
          let typeInstance: string = type["instance"];
          if (/^(secure|password|salt|updatedAt|createdAt)/.test(path)) {
            return;
          }
          if (/string/i.test(typeInstance)) {
            $or.push({ [path]: reg });
          }
        });
      }
    }

    if ($or.length) {
      cond.$or = cond.$or || [];
      cond.$or = [...$or, ...cond.$or];
    }

    let result = await this.Model.find(cond)
      .select(select)
      .sort(sort || undefined)
      .skip(+begin)
      .limit(+pageSize || undefined)
      .populate(populate || "")
      .exec();
    let total = await this.Model.countDocuments(cond);
    let totalPage = Math.ceil(total / pageSize);
    return {
      page: {
        total,
        totalPage,
        pageNo,
        pageSize: pageSize || total
      },
      data: result
    };
  }

  async get(id: mongoose.Types.ObjectId, populate = "") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw "Id Invalid";
    }
    const result = await this.Model.findById(id).populate(populate);
    return result;
  }

  async count(cond: any = {}) {
    let ins = new this.Model();
    if (!ins.schema.path("companyId")) {
      delete cond.companyId;
    }
    const count = await this.Model.countDocuments(cond);
    return count;
  }

  async create(obj: any = {}) {
    let result = await this.Model.create(obj);
    return result;
  }

  async update(id: mongoose.Types.ObjectId, obj = <any>{}) {
    let m = await this.Model.findById(id);

    if (!m) {
      throw `${this.Model.modelName} Not Found`;
    }

    delete obj._id;
    // m = Object.assign(m, obj);
    // let result = await m.save();

    // to fix the embed document updating
    await this.Model.updateOne({ _id: id }, { $set: obj });

    // to fire save trigger
    m = await this.Model.findById(id);
    let result = await m.save();

    return result;
  }

  async bulkUpdate(idArr: mongoose.Types.ObjectId[], obj = <any>{}) {
    delete obj._id;
    let result = await this.Model.updateMany({ _id: { $in: idArr } }, obj);
    return result;
  }

  async remove(id: mongoose.Types.ObjectId) {
    let m = await this.Model.findById(id);
    if (!m) {
      throw `${this.Model.modelName} Not Found`;
    }
    let result = await m.remove();
    return result;
  }

  async searchRecords<T>(records: T[], q = "") {
    let result = [...records];
    if (q) {
      result = records.filter(r => {
        let pass = false;
        let reg = new RegExp(q, "i");
        for (let i in r) {
          if (!/secure|password|salt|updatedAt|createdAt/i.test(i) && typeof r[i] == "string" && reg.test("" + r[i])) {
            pass = true;
            break;
          }
        }
        return pass;
      });
    }
    return result;
  }

  async getPaginationResult<T>(records: T[], pageNo = 1, pageSize = 20, sort = "") {
    pageNo = +pageNo;
    pageSize = +pageSize;
    let sortAsc = !!/^-/.test(sort);
    let sortName = sort.replace(/^-/, "");
    if (sort) {
      records = records.sort(function(a, b) {
        return (a[sortName] > b[sortName] ? -1 : 1) * (sortAsc ? 1 : -1);
      });
    }

    let begin = (pageNo - 1) * pageSize;
    let total = records.length;
    let totalPage = Math.ceil(total / pageSize);
    let result = records.slice(begin, begin + pageSize);
    return {
      page: {
        total,
        totalPage,
        pageNo,
        pageSize
      },
      data: result
    };
  }
}

export { BaseService };
