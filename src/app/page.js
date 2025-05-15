import {
  FiBook,
  FiDollarSign,
  FiUsers,
  FiChevronsDown,
  FiHome,
} from "react-icons/fi";
import Content from "@/components/Content";
import ExportButton from "@/components/ExportButton";

export default function Dashboard() {
  return (
    <Content>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-white dark:text-gray-300">
          Dashboard
        </h1>

        <div className="flex items-center justify-end space-x-4">
          <label className="text-gray-900 dark:text-gray-300 text-xl">
            ปีการศึกษา
          </label>

          <select className="p-4 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-lg focus:outline-none w-28 text-right text-gray-800 dark:text-gray-300 items-center">
            <option className="text-left">2 / 2568</option>
            <option className="text-left">1 / 2568</option>
            <option className="text-left">2 / 2567</option>
            <option className="text-left">1 / 2567</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "รายวิชาที่เปิดให้บริการ",
            value: "120",
            unit: "รายวิชา",
            icon: <FiBook className="text-blue-500" />,
            bg: "bg-green-100",
          },
          {
            title: "ต้นทุนรวม",
            value: "11,810,124",
            unit: "บาท",
            icon: <FiDollarSign className="text-green-500" />,
            bg: "bg-orange-100",
          },
          {
            title: "จำนวนนักศึกษา",
            value: "23,644",
            unit: "คน",
            icon: <FiUsers className="text-purple-500" />,
            bg: "bg-blue-200",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 transition-transform transform hover:scale-105 ${stat.bg}`}>
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <h3 className="text-gray-800 dark:text-gray-300">{stat.title}</h3>
              <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                <p className="text-2xl font-semibold text-black dark:text-white">
                  {stat.value}
                </p>
                {stat.unit && <p className="text-gray-500">{stat.unit}</p>}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="collapse bg-gray-100 dark:bg-gray-800 mt-2">
        <input type="radio" name="my-accordion-1" defaultChecked />
        <div className="collapse-title text-xl font-medium text-gray-800 dark:text-gray-300 flex items-center space-x-2">
          <FiChevronsDown className="text-purple-500" />{" "}
          <p>ฝ่ายห้องปฏิบติการ</p>
        </div>
        <div className="collapse-content text-gray-800 dark:text-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "วิทยาศาสตร์สุขภาพ",
                value: "10",
                number: "20",
                unit: "รายวิชา",
                icon: <FiHome className="text-green-500" />,
                unitn: "ห้องปฏิบัติการ",
              },
              {
                title: "วิทยาศาสตร์พื้นฐาน",
                value: "30",
                number: "29",
                unit: "รายวิชา",
                icon: <FiHome className="text-red-500" />,
                unitn: "ห้องปฏิบัติการ",
              },
              {
                title: "วิทยาศาสตร์เทคโนโลยี",
                value: "40",
                number: "35",
                unit: "รายวิชา",
                icon: <FiHome className="text-purple-500" />,
                unitn: "ห้องปฏิบัติการ",
              },
              {
                title: "วิทยาศาสตร์การแพทย์",
                value: "50",
                number: "45",
                unit: "รายวิชา",
                icon: <FiHome className="text-purple-500" />,
                unitn: "ห้องปฏิบัติการ",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-gray-200 dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 transition-transform transform hover:scale-105 ${stat.bg}`}>
                <div className="text-4xl">{stat.icon}</div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                    <p className="text-2xl font-semibold text-black dark:text-white p-2">
                      {stat.value}
                    </p>
                    {stat.unit && <p className="text-gray-500">{stat.unit}</p>}
                    <p>|</p>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                      <p className="text-2xl font-semibold text-black dark:text-white">
                        {stat.number}
                      </p>
                      {stat.unitn && (
                        <p className="text-gray-500">{stat.unitn}</p>
                      )}
                    </span>
                  </span>{" "}
                  <div className="mt-2  items-center text-xs bg-gray-300 dark:bg-gray-700 p-2 rounded-lg">
                    <div className="flex items-center text-gray-800 dark:text-gray-300 justify-center">
                      <span className="text-base"> {stat.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="collapse bg-gray-100 dark:bg-gray-800 mt-2">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium text-gray-800 dark:text-gray-300 flex items-center space-x-2">
          <FiChevronsDown className="text-purple-500" /> <p>รายงาน</p>
        </div>
        <div className="collapse-content">
          <div className="flex justify-end mb-4">
            <ExportButton tableId="reportTable" fileName="report" />
          </div>
          <div className="overflow-x-auto text-gray-800 dark:text-gray-300">
            <table
              id="reportTable"
              className="table table-xs text-gray-800 dark:text-gray-300 p-4">
              <thead>
                <tr className="text-gray-800 dark:text-gray-100">
                  <th>#</th>
                  <th>สำนักวิชา</th>
                  <th>หลักสูตร</th>
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา (ภาษาไทย)</th>
                  <th>จำนวนนักศึกษา</th>
                  <th>ต้นทุนรวม</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>วิทยาศาสตร์</td>
                  <td>คอมพิวเตอร์</td>
                  <td>CS101</td>
                  <td>โครงสร้างข้อมูล</td>
                  <td>50</td>
                  <td>100,000</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>วิศวกรรมศาสตร์</td>
                  <td>วิศวกรรมไฟฟ้า</td>
                  <td>EE201</td>
                  <td>วงจรไฟฟ้า</td>
                  <td>40</td>
                  <td>80,000</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>บริหารธุรกิจ</td>
                  <td>การจัดการ</td>
                  <td>MG301</td>
                  <td>การบริหารองค์กร</td>
                  <td>60</td>
                  <td>120,000</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>แพทยศาสตร์</td>
                  <td>แพทยศาสตร์</td>
                  <td>MD101</td>
                  <td>กายวิภาคศาสตร์</td>
                  <td>45</td>
                  <td>200,000</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>วิทยาศาสตร์</td>
                  <td>ชีววิทยา</td>
                  <td>BI201</td>
                  <td>ชีววิทยาทั่วไป</td>
                  <td>55</td>
                  <td>90,000</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>วิศวกรรมศาสตร์</td>
                  <td>โยธา</td>
                  <td>CE301</td>
                  <td>กลศาสตร์โครงสร้าง</td>
                  <td>35</td>
                  <td>70,000</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>มนุษยศาสตร์</td>
                  <td>ภาษาอังกฤษ</td>
                  <td>EN101</td>
                  <td>การเขียนภาษาอังกฤษ</td>
                  <td>80</td>
                  <td>60,000</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>นิติศาสตร์</td>
                  <td>กฎหมาย</td>
                  <td>LA101</td>
                  <td>กฎหมายเบื้องต้น</td>
                  <td>70</td>
                  <td>110,000</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>เกษตรศาสตร์</td>
                  <td>พืชไร่</td>
                  <td>AG101</td>
                  <td>การเพาะปลูกพืช</td>
                  <td>40</td>
                  <td>95,000</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>วิทยาศาสตร์</td>
                  <td>เคมี</td>
                  <td>CH201</td>
                  <td>เคมีอินทรีย์</td>
                  <td>50</td>
                  <td>85,000</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>ศิลปกรรมศาสตร์</td>
                  <td>ดนตรี</td>
                  <td>MU101</td>
                  <td>พื้นฐานดนตรี</td>
                  <td>30</td>
                  <td>75,000</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>วิศวกรรมศาสตร์</td>
                  <td>คอมพิวเตอร์</td>
                  <td>CS202</td>
                  <td>ระบบปฏิบัติการ</td>
                  <td>60</td>
                  <td>105,000</td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>วิศวกรรมศาสตร์</td>
                  <td>เครื่องกล</td>
                  <td>ME301</td>
                  <td>กลศาสตร์ของไหล</td>
                  <td>45</td>
                  <td>95,000</td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>บริหารธุรกิจ</td>
                  <td>บัญชี</td>
                  <td>AC101</td>
                  <td>บัญชีพื้นฐาน</td>
                  <td>70</td>
                  <td>100,000</td>
                </tr>
                <tr>
                  <td>15</td>
                  <td>มนุษยศาสตร์</td>
                  <td>จิตวิทยา</td>
                  <td>PS101</td>
                  <td>จิตวิทยาทั่วไป</td>
                  <td>50</td>
                  <td>80,000</td>
                </tr>
                <tr>
                  <td>16</td>
                  <td>สาธารณสุข</td>
                  <td>สาธารณสุขศาสตร์</td>
                  <td>PH101</td>
                  <td>สุขศึกษา</td>
                  <td>55</td>
                  <td>90,000</td>
                </tr>
                <tr>
                  <td>17</td>
                  <td>เศรษฐศาสตร์</td>
                  <td>เศรษฐศาสตร์</td>
                  <td>EC101</td>
                  <td>เศรษฐศาสตร์จุลภาค</td>
                  <td>65</td>
                  <td>95,000</td>
                </tr>
                <tr>
                  <td>18</td>
                  <td>เทคโนโลยีสารสนเทศ</td>
                  <td>IT</td>
                  <td>IT101</td>
                  <td>เครือข่ายคอมพิวเตอร์</td>
                  <td>50</td>
                  <td>85,000</td>
                </tr>
                <tr>
                  <td>19</td>
                  <td>แพทยศาสตร์</td>
                  <td>พยาบาลศาสตร์</td>
                  <td>NU101</td>
                  <td>การพยาบาลพื้นฐาน</td>
                  <td>40</td>
                  <td>150,000</td>
                </tr>
                <tr>
                  <td>20</td>
                  <td>มนุษยศาสตร์</td>
                  <td>ประวัติศาสตร์</td>
                  <td>HI101</td>
                  <td>ประวัติศาสตร์ไทย</td>
                  <td>75</td>
                  <td>70,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Content>
  );
}
