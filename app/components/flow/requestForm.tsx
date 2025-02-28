import { useState } from "react";
import CustomSelect from "@/app/components/customSelect";
import DatePicker from "@/app/components/datePicker";
import TimePicker from "@/app/components/timePicker";
import NumberInput from "@/app/components/numberInput";
import RadioButton from "@/app/components/radioButton";
import Tooltip from "@/app/components/tooltips";

export default function RequestForm(){
     const [fileName, setFileName] = useState("อัพโหลดเอกสารแนบ");
      const [selectedTravelType, setSelectedTravelType] = useState('');
      const driverOptions = [
        "ศรัญยู บริรัตน์ฤทธิ์ (505291)",
        "ธนพล วิจารณ์ปรีชา (514285)",
        "ญาณิศา อุ่นสิริ (543210)"
    ];
    
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileName(file ? file.name : "อัพโหลดเอกสารแนบ");
      };
    return (
        <>
        <div className="form-steps-group">
                     <div className="form-steps" data-step="1">
                       <div className="form-section">
                         <div className="page-section-header border-0">
                           <div className="page-header-left">
                             <div className="page-title">
                               <span className="page-title-label">
                                 ข้อมูลผู้ใช้ยานพาหนะ
                               </span>
                             </div>
                           </div>
                         </div>
       
                         <div className="grid grid-cols-1 md:grid-cols-4 flex-col md:flex-row w-full flex-wrap gap-5">
                           <div className="flex-1">
                             <div className="form-group">
                               <label className="form-label">
                                 ผู้ใช้ยานพาหนะ
                                 <Tooltip
                                   title="ผู้ใช้ยานพาหนะคือ?"
                                   content="คือคนที่รับผิดชอบยานพาหนะในการเดินทางครั้งนี้ มีหน้าที่ในการกรอกเลขไมล์และ เบิกค่าน้ำมัน"
                                   position="right"
                                 >
                                   <i className="material-symbols-outlined">info</i>
                                 </Tooltip>
                               </label>
       
                               <CustomSelect iconName="person" w="w-full" options={driverOptions} />
                               </div>
                             
                           </div>
       
                           <div className="flex-1">
                             <div className="form-group">
                               <label className="form-label">ตำแหน่ง / สังกัด</label>
                               <div className="input-group is-readonly">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">
                                       business_center
                                     </i>
                                   </span>
                                 </div>
                                 <input
                                   type="text"
                                   className="form-control"
                                   placeholder=""
                                 />
                               </div>
                             </div>
                           </div>
       
                           <div className="flex-1">
                             <div className="form-group">
                               <label className="form-label">เบอร์ภายใน</label>
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">call</i>
                                   </span>
                                 </div>
                                 <input
                                   type="text"
                                   className="form-control"
                                   placeholder="ระบุเบอร์ภายใน"
                                 />
                               
                               </div>
                             
                             </div>
                           </div>
       
                           <div className="flex-1">
                             <div className="form-group">
                               <label className="form-label">เบอร์โทรศัพท์</label>
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">
                                       smartphone
                                     </i>
                                   </span>
                                 </div>
                                 <input
                                   type="text"
                                   className="form-control"
                                   placeholder="ระบุเบอร์โทรศัพท์"
                                 />
                                
                               </div>
                              
                             </div>
                           </div>
                         </div>
                       </div>
       
                       <div className="form-section">
                         <div className="page-section-header border-0">
                           <div className="page-header-left">
                             <div className="page-title">
                               <span className="page-title-label">
                                 รายละเอียดการเดินทาง
                               </span>
                             </div>
                           </div>
                         </div>
       
                         <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                           <div className="col-span-6 md:col-span-3">
                             <div className="form-group">
                               <label className="form-label">
                                 วันที่เริ่มต้นเดินทาง
                               </label>
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">
                                       calendar_month
                                     </i>
                                   </span>
                                 </div>
                                 <DatePicker
                                   placeholder="ระบุวันที่"
                                 />
                                 {/* <!-- <div className="input-group-append">
                                 <span className="input-group-text search-ico-trailing">
                                   <i className="material-symbols-outlined">close</i>
                                 </span>
                               </div> --> */}
                               </div>
                             </div>
                           </div>
       
                           <div className="col-span-6 md:col-span-3">
                             <div className="form-group">
                               <label className="form-label">
                                 วันที่สิ้นสุดเดินทาง 
                               </label>
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">
                                       calendar_month
                                     </i>
                                   </span>
                                 </div>
                                   <DatePicker
                                   placeholder="ระบุวันที่"
                                 />
                               </div>
                             </div>
                           </div>
       
                           <div className="col-span-12 md:col-span-3 journey-time">
                             <div className="form-group">
                               <label className="form-label">ช่วงเวลาการเดินทาง</label>
                                 <div className="input-group">
                               <TimePicker />
                               </div>
                             </div>
                           </div>
       
                           <div className="col-span-12 md:col-span-3">
                             <div className="form-group">
                               <label className="form-label">ประเภทการเดินทาง</label>
                               <div className="custom-group">
                                 <RadioButton
                                   name="travelType"
                                   label="ไป-กลับ"
                                   value="ไป-กลับ"
                                   selectedValue={selectedTravelType}
                                   setSelectedValue={setSelectedTravelType}
                                 />
       
                                 <RadioButton
                                   name="travelType"
                                   label="ค้างแรม"
                                   value="ค้างแรม"
                                   selectedValue={selectedTravelType}
                                   setSelectedValue={setSelectedTravelType}
                                 />
                               </div>
                             </div>
                           </div>
       
                           <div className="col-span-12 md:col-span-6">
                             <div className="form-group">
                               <label className="form-label">สถานที่ปฏิบัติงาน</label>
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">
                                       emoji_transportation
                                     </i>
                                   </span>
                                 </div>
                                 <input
                                   type="text"
                                   className="form-control"
                                   placeholder="ระบุสถานที่ปฏิบัติงาน"
                                 />
                                 {/* <!-- <div className="input-group-append">
                                 <span className="input-group-text search-ico-trailing">
                                   <i className="material-symbols-outlined">close</i>
                                 </span>
                               </div> --> */}
                               </div>
                             </div>
                           </div>
       
                           <div className="col-span-12 md:col-span-6">
                             <div className="form-group">
                               <label className="form-label">วัตถุประสงค์</label>
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">
                                       target
                                     </i>
                                   </span>
                                 </div>
                                 <input
                                   type="text"
                                   className="form-control"
                                   placeholder="ระบุวัตถุประสงค์"
                                 />
                                 {/* <!-- <div className="input-group-append">
                                 <span className="input-group-text search-ico-trailing">
                                   <i className="material-symbols-outlined">close</i>
                                 </span>
                               </div> --> */}
                               </div>
                             </div>
                           </div>
       
                           <div className="col-span-12 md:col-span-2">
                             <div className="form-group">
                               <label className="form-label">
                                 จำนวนผู้โดยสาร{" "}
                                 <span className="form-optional">(รวมผู้ขับขี่)</span>
                               </label>
       
                               <NumberInput />
       
                             </div>
                           </div>
       
                           <div className="col-span-12 md:col-span-10">
                             <div className="form-group">
                               <label className="form-label">
                                 หมายเหตุ{" "}
                                 <span className="form-optional">(ถ้ามี)</span>
                               </label>
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">sms</i>
                                   </span>
                                 </div>
                                 <input
                                   type="text"
                                   className="form-control"
                                   placeholder="ระบุหมายเหตุ"
                                 />
                                 {/* <!-- <div className="input-group-append">
                                 <span className="input-group-text search-ico-trailing">
                                   <i className="material-symbols-outlined">close</i>
                                 </span>
                               </div> --> */}
                               </div>
                             </div>
                           </div>
       
                           <div className="col-span-12 md:col-span-3">
                             <div className="form-group">
                               <label className="form-label">
                                 เลขที่หนังสืออ้างอิง{" "}
                                 <span className="form-optional">(ถ้ามี)</span>
                               </label>
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">docs</i>
                                   </span>
                                 </div>
                                 <input
                                   type="text"
                                   className="form-control"
                                   placeholder="ระบุเลขที่หนังสืออ้างอิง"
                                 />
                                 {/* <!-- <div className="input-group-append">
                                 <span className="input-group-text search-ico-trailing">
                                   <i className="material-symbols-outlined">close</i>
                                 </span>
                               </div> --> */}
                               </div>
                             </div>
                           </div>
       
                           <div className="col-span-12 md:col-span-3">
                             <div className="form-group">
                               <label className="form-label">
                                 เอกสารแนบ{" "}
                                 <span className="form-optional">(ถ้ามี)</span>
                               </label>
                               <div className="input-group input-uploadfile">
                                 {/* <input type="file" className="file-input hidden" /> */}
                                 <label className="flex items-center gap-2 cursor-pointer">
                                   <div className="input-group-prepend">
                                     <span className="input-group-text">
                                       <i className="material-symbols-outlined">
                                         attach_file
                                       </i>
                                     </span>
                                   </div>
                                   <input
                                     type="file"
                                     className="file-input hidden"
                                     onChange={handleFileChange}
                                   />
                                   <div className="input-uploadfile-label w-full">
                                     {fileName}
                                   </div>
                                 </label>
       
                                 {/* <!-- <div className="input-group-append">
                                 <span className="input-group-text search-ico-trailing">
                                   <i className="material-symbols-outlined">close</i>
                                 </span>
                               </div> --> */}
                               </div>
                               <span className="form-helper">
                                 รองรับไฟล์ประเภท pdf เท่านั้นขนาดไม่เกิน 20 MB
                               </span>
                             </div>
                           </div>
                         </div>
                       </div>
       
                       <div className="form-section">
                         <div className="page-section-header border-0">
                           <div className="page-header-left">
                             <div className="page-title">
                               <span className="page-title-label">
                                 การเบิกค่าใช้จ่าย
                               </span>
                             </div>
                           </div>
                         </div>
       
                         <div className="grid gap-5 grid-cols-12">
                           <div className="md:col-span-3 col-span-12">
                             <div className="form-group">
                               <label className="form-label">ประเภทงบประมาณ</label>
       
                               <div className="input-group">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">paid</i>
                                   </span>
                                 </div>
                                 <select data-title="Input dropdown">
                                   <option>หน่วยงานต้นสังกัด</option>
                                   <option>List item</option>
                                   <option>List item</option>
                                 </select>
                               </div>
                             </div>
                           </div>
       
                           <div className="md:col-span-3 col-span-12">
                             <div className="form-group">
                               <label className="form-label">ศูนย์ต้นทุน</label>
                               <div className="input-group is-readonly">
                                 <div className="input-group-prepend">
                                   <span className="input-group-text">
                                     <i className="material-symbols-outlined">
                                       crop_free
                                     </i>
                                   </span>
                                 </div>
                                 <input
                                   type="text"
                                   className="form-control"
                                   placeholder=""
                                 />
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                     <div className="form-action">
                                 <button className="btn btn-primary" disabled>
                                   ต่อไป
                                   <i className="material-symbols-outlined icon-settings-300-24">
                                     arrow_right_alt
                                   </i>
                                 </button>
                               </div>
       
        </>
    );
}