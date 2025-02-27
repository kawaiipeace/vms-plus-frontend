import Image from "next/image";

export default function AutoCarCard({
  imgSrc,
  title,
  desc,
}: {
  imgSrc: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-img-top h-[27vh]">
          <Image
            src={imgSrc}
            width={100}
            height={100}
            className=""
            alt="..."
          ></Image>
        </div>
        <div className="card-content">
          <div className="card-content-top">
            <div className="card-title">{ title }</div>
            <div className="card-supporting-text-group">
              <div className="card-supporting-text">{ desc }</div>
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary">เลือกประเภท</button>
        </div>
      </div>
    </div>
  );
}
