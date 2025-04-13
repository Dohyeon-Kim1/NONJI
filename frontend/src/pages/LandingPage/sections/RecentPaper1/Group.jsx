import React from "react";
// 아래 경로가 실제 RP_hashtag 컴포넌트 위치와 일치하는지 확인하세요.
import { RP_hashtag } from "../../../../components/components/RP_hashtag";
import "./style.css";

export const Group = ({ name, title, content }) => {
  return (
    <div className="group">
      {/* 상단 헤더 영역 */}
      <div className="group-header">
        {/* 왼쪽: 프로필 및 기본 정보 */}
        <div className="header-left">
          <img
            className="RP_user_img"
            alt="Profile"
            src="/img/ellipse-1699.svg"
          />
          <div className="header-info">
            <div className="RP_user_name">{name}</div>
            <div className="RP_time">12:45AM</div>
          </div>
          <div className="RP_my_paper">My Paper</div>
        </div>
        {/* 오른쪽: 원본 링크 & 북마크 아이콘 */}
        <div className="header-right">
          <div className="RP_link">
            <img
              className="RP_link_img"
              alt="Original Link"
              src="/img/group-1686557946.png"
            />
            <div className="RP_link_txt">See the original</div>
          </div>
          <img
            className="RP_bookmark"
            alt="Bookmark"
            src="/img/vector-4.svg"
          />
        </div>
      </div>

      {/* 메인 영역 (논문 제목 및 본문) */}
      <div className="group-main">
        <p className="RP_paper_title">{title}</p>
        <div className="group-content">
          <div className="RP_paper_content">{content}</div>
          <img
            className="RP_paper_img"
            alt="Paper"
            src="/img/image-64.png"
          />
        </div>
      </div>

      {/* 하단 영역 (해시태그, 인터랙션) */}
      <div className="group-footer">
        {/* 해시태그 영역 */}
        <div className="RP_tags">
          {/* 
              만약 RP_hashtag 컴포넌트가 정상 동작하지 않는다면 아래처럼 단순 div나 span으로 대체해보세요.
              <div className="RP_tag">#Multimodal</div>
          */}
          <RP_hashtag className="RP_tag" divClassName="RP_frame-instance" text="#Multimodal" />
          <RP_hashtag className="RP_tag" divClassName="RP_frame-instance" text="#Affordance" />
          <RP_hashtag className="RP_tag" divClassName="RP_frame-instance" text="#Perceiver" />
          <RP_hashtag className="RP_tag" divClassName="RP_frame-instance" text="#Grasping2222" />
        </div>
        {/* 인터랙션 영역 */}
        <div className="RP_inters">
          <div className="RP_inter_frame">
            <img
              className="RP_inter"
              alt="Like"
              src="/img/vector.svg"
            />
            <div className="RP_inter_num">1325</div>
          </div>
          <div className="RP_inter_frame">
            <img
              className="RP_inter"
              alt="Comment"
              src="/img/vector-1.svg"
            />
            <div className="RP_inter_num">72</div>
          </div>
          <div className="RP_colab_frame">
            <div className="RP_colab">Colab</div>
            <img
              className="RP_pp"
              alt="Collab"
              src="/img/pp.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};