// pages/introduction.tsx
"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./style.css";

import Image from "next/image";
import Head from "next/head";
// Đảm bảo import style.css trong _app.tsx hoặc layout.tsx

const teamData = [
  {
    id: 1,
    name: "Ban Truyền thông & Sự kiện",
    image: "/Img/Introduction/TTSK_Img.png",
    shortDesc:
      "Ban Truyền thông là nơi hội tụ của các bạn sinh viên yêu thích truyền thông, nhiệt tình, năng động và sáng tạo.",
    fullDesc:
      "Ban Truyền thông & Sự kiện là nơi hội tụ của các bạn sinh viên yêu thích truyền thông, nhiệt tình, năng động và sáng tạo. Chịu trách nhiệm chính trong việc quản lý các kênh truyền thông của Đoàn khoa, đưa tin các hoạt động, chương trình và phụ trách công tác tổ chức sự kiện. Ban truyền thông không chỉ cung cấp thông tin mà còn tạo nên những cầu nối giữa sinh viên với các hoạt động của Đoàn khoa.",
    activities: [
      "Quản lý và phát triển các kênh truyền thông",
      "Đưa tin, bài về các hoạt động của Đoàn khoa",
      "Tổ chức và hỗ trợ các sự kiện của Đoàn khoa",
      "Thiết kế các nội dung truyền thông",
    ],
    contact: "Email: truyenthong.mmtt@uit.edu.vn",
  },
  {
    id: 2,
    name: "Ban Thiết kế",
    image: "/Img/Introduction/BTK_Img.png",
    shortDesc:
      "Ban Thiết kế là nơi hội tụ của những tâm hồn sáng tạo, yêu thích đồ họa và mỹ thuật số.",
    fullDesc:
      "Ban Thiết kế là nơi hội tụ của những tâm hồn sáng tạo, yêu thích đồ họa và mỹ thuật số. Chịu trách nhiệm chính trong các thiết kế poster, banner, hình ảnh minh họa các sự kiện, giúp nội dung truyền thông trở nên sinh động và thu hút hơn. Nếu bạn có niềm đam mê với Photoshop, Illustrator hay các phần mềm thiết kế nào khác thì Ban Thiết kế chính là nơi để bạn phát triển và thể hiện tài năng của mình.",
    activities: [
      "Thiết kế poster, banner cho các sự kiện",
      "Tạo các ấn phẩm truyền thông cho Đoàn khoa",
      "Biên tập hình ảnh, video cho các hoạt động",
      "Tổ chức các khóa tập huấn về kỹ năng thiết kế",
    ],
    contact: "Email: thietke.mmtt@uit.edu.vn",
  },
  {
    id: 3,
    name: "Ban Học tập",
    image: "/Img/Introduction/BHT_Img.png",
    shortDesc:
      "Ban Học tập tập trung vào việc hỗ trợ các hoạt động học thuật, tổ chức các buổi hội thảo và chia sẻ kiến thức chuyên môn.",
    fullDesc:
      "Ban Học tập là đơn vị đảm nhận vai trò chính trong việc tổ chức các hoạt động học thuật, nghiên cứu và phát triển kỹ năng chuyên môn cho sinh viên khoa MMT&TT. Ban Học tập thường xuyên tổ chức các buổi hội thảo, workshop, cuộc thi học thuật và các hoạt động trao đổi kiến thức nhằm nâng cao năng lực học tập và nghiên cứu của sinh viên trong khoa.",
    activities: [
      "Tổ chức các buổi hội thảo, workshop chuyên môn",
      "Tổ chức các cuộc thi học thuật, nghiên cứu khoa học",
      "Tổ chức các nhóm học tập, trao đổi kiến thức",
      "Hỗ trợ sinh viên trong học tập và nghiên cứu",
    ],
    contact: "Email: hoctap.mmtt@uit.edu.vn",
  },
];

const Introduction = () => {
  // State để quản lý ID của ban đang được mở rộng
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  // Hàm để chuyển đổi trạng thái hiển thị chi tiết của ban
  const toggleTeamDetails = (teamId) => {
    if (expandedTeamId === teamId) {
      // Nếu đang mở ban này, đóng nó lại
      setExpandedTeamId(null);
    } else {
      // Nếu đang đóng hoặc mở ban khác, mở ban này
      setExpandedTeamId(teamId);
    }
  };

  return (
    <>
      <Head>
        <title>Giới Thiệu - Đoàn Khoa Mạng Máy Tính và Truyền Thông</title>
        <meta
          name="description"
          content="Giới thiệu về Đoàn Khoa Mạng Máy Tính và Truyền Thông - Trường Đại học Công nghệ Thông tin - ĐHQG-HCM"
        />
        {/* Thêm meta viewport để kiểm soát responsive tốt hơn */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="background">
        <Header />

        {/* Hero Banner */}
        <section className="hero">
          <div
            className="hero_background"
            style={{
              backgroundImage: 'url("/Img/Introduction/HeroImg.png")',
            }}
          />
          <div className="hero_overlay"></div>
          <div className="container hero_container">
            <div className="hero_container_subtitle">ĐOÀN KHOA</div>
            <h1 className="hero_container_title">
              MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
            </h1>
            <p className="hero_container_description">
              Đoàn TNCS Hồ Chí Minh Khoa Mạng máy tính và Truyền thông là mái
              nhà chung của hơn 1.195 Đoàn viên và sinh viên thuộc quy tụ 22 Chi
              đoàn đang học tập và sinh hoạt tại Trường Đại học Công nghệ Thông
              tin. Trong đó, 14 Chi đoàn thuộc Chương trình Đại trà, 4 Chi đoàn
              thuộc Chương trình Chất lượng cao và 4 Chi đoàn thuộc Chương trình
              Tài năng. Cùng với sự phát triển của khoa, tổ chức Đoàn cũng đạt
              được những bước tiến về quy mô và chất lượng hoạt động.
            </p>
          </div>
        </section>

        {/* History Section */}
        <section className="history">
          <div className="history_container">
            <p className="history_container_text">
              Đúng ở vị trí là một đơn vị Đoàn có số đoàn viên xấp xỉ 35% so với
              Đoàn trường, được hình thành chính thức từ ngày 17/11/2014 từ tổ
              chức Liên Chi đoàn khoa, trực thuộc Đoàn trường Đại học Công nghệ
              Thông tin - ĐHQG-HCM, dẫu không chỉ là nơi để các bạn đoàn viên
              trao đổi, học tập và rèn luyện mà còn là môi trường phát triển
              toàn diện về thể chất và tinh thần. Ngày nay, Đoàn khoa MMTT&T
              luôn thực hiện và hoàn thành xuất sắc các nhiệm vụ của công tác
              Đoàn và phong trào thanh niên.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="values">
          <div className="values_container">
            <h2 className="values_container_heading">Phương châm</h2>
            <div className="values_container_motto">
              ĐOÀN KẾT - TIÊN PHONG - TRÁCH NHIỆM - ĐỔI MỚI
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="description">
          <div className="description_container">
            <div className="description_container_flex">
              <div className="description_container_flex_left">
                <p className="description_container_flex_left_text">
                  Với truyền thống, lịch sử hình thành và phát triển của mình,
                  cho đến nay Đoàn khoa MMT&TT đang quản lý 17 Chi đoàn trực
                  thuộc, các ban chuyên môn và các đội hỗ trợ đoàn khoa. Liên
                  Chi Đoàn khoa MMT&TT không ngừng mạnh về số lượng, nâng cao về
                  chất lượng sinh hoạt Đoàn cơ sở. Đây là nơi tổ chức nhiều hoạt
                  động phong phú, từ các hoạt hội thảo, các khóa học, câu lạc bộ
                  kỹ năng đến các chương trình tình nguyện và văn nghệ. Mỗi hoạt
                  động đều mang lại cơ hội để các bạn sinh viên rèn luyện, giao
                  lưu và trưởng thành.
                </p>
              </div>
              <div className="description_container_flex_right">
                <div className="description_container_flex_right_wrapper">
                  <Image
                    src="/Img/Introduction/BCH_Img.png"
                    alt="Đoàn viên Khoa MMT&TT"
                    width={500}
                    height={300}
                    className="description_container_flex_right_wrapper_image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teams Section */}
        <section className="teams">
          <div className="teams_container">
            <h2 className="teams_container_title">CÁC BAN CHUYÊN MÔN</h2>

            <div className="teams_container_grid">
              {teamData.map((team) => (
                <div key={team.id} className="teams_container_accordion">
                  <div
                    className={`teams_container_accordion_card ${
                      expandedTeamId === team.id
                        ? "teams_container_accordion_card--active"
                        : ""
                    }`}
                    onClick={() => toggleTeamDetails(team.id)}
                  >
                    <div className="teams_container_accordion_card_wrapper">
                      <Image
                        src={team.image}
                        alt={team.name}
                        width={400}
                        height={300}
                        className="teams_container_accordion_card_wrapper_image"
                      />
                    </div>
                    <h3
                      className={`teams_container_accordion_card_title ${
                        expandedTeamId === team.id
                          ? "teams_container_accordion_card_title--expanded"
                          : "teams_container_accordion_card_title--collapsed"
                      }`}
                    >
                      {team.name}
                    </h3>
                    <p className="teams_container_accordion_card_description">
                      {team.shortDesc}
                    </p>
                  </div>

                  {/* Phần nội dung chi tiết mở rộng */}
                  <div
                    className={`teams_container_accordion_details ${
                      expandedTeamId === team.id
                        ? "teams_container_accordion_details--expanded"
                        : ""
                    }`}
                  >
                    <div className="teams_container_accordion_details_content">
                      <p className="teams_container_accordion_details_content_description">
                        {team.fullDesc}
                      </p>

                      <div className="teams_container_accordion_details_content_activities">
                        <h4 className="teams_container_accordion_details_content_activities_title">
                          Hoạt động chính
                        </h4>
                        <ul className="teams_container_accordion_details_content_activities_list">
                          {team.activities.map((activity, index) => (
                            <li
                              key={index}
                              className="teams_container_accordion_details_content_activities_list_item"
                            >
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="teams_container_accordion_details_content_contact">
                        <p className="teams_container_accordion_details_content_contact_info">
                          {team.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leader Section */}
        <section className="leader">
          <div className="leader_container">
            <div className="leader_container_flex">
              <div className="leader_container_flex_left">
                <div className="leader_container_flex_left_card">
                  <Image
                    src="/Img/Introduction/TestVideo.png"
                    alt="TS. LÊ TRUNG QUÂN"
                    width={400}
                    height={400}
                    className="leader_container_flex_left_card_image"
                  />
                  <div className="leader_container_flex_left_card_info">
                    <h4 className="leader_container_flex_left_card_info_name">
                      TS. LÊ TRUNG QUÂN
                    </h4>
                  </div>
                </div>
              </div>
              <div className="leader_container_flex_right">
                <p className="leader_container_flex_right_text">
                  Với sự nỗ lực không ngừng, Đoàn Khoa MMT&TT đã và đang là một
                  trong những đơn vị đầu tàu trong công tác Đoàn và phong trào
                  thanh niên tại Trường Đại học Công nghệ Thông tin – ĐHQG-HCM.
                  Đây chính là "người bạn đồng hành" đang tin cậy của sinh viên,
                  thanh niên khoa MMT&TT, giúp các bạn sinh viên phát triển toàn
                  diện và vững bước trên con đường học tập và rèn luyện.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Introduction;
