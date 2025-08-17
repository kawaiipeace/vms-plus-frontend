import { shortenFilename } from "@/utils/shortenFilename";
import Link from "next/link";

interface RefProps {
  refNum?: string;
  file?: string;
  link?:string;
}

export default function ReferenceCard({ refNum, file, link }: RefProps) {

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">description</i>
              <div className="form-plaintext-group">
                <div className="form-label">เลขที่หนังสืออ้างอิง</div>
                <div className="form-text">{refNum}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">attach_file</i>
              <div className="form-plaintext-group">
                <div className="form-label">เอกสารแนบ</div>
                <Link href={link ? link : "#"} target="__blank" className="form-text text-info">
                  {shortenFilename(file || "")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
