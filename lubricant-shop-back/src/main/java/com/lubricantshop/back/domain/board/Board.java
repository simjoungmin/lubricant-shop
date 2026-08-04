package com.lubricantshop.back.domain.board;

import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.product.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

// 공지, 상품 문의, 1:1 문의 등 게시판성 글을 저장하는 엔티티입니다.
@Entity
@Table(name = "board")
public class Board {

    // 게시글 고유 ID입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    // 게시글을 작성한 회원입니다.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "writer_id",
            nullable = false,
            referencedColumnName = "member_id",
            foreignKey = @ForeignKey(name = "fk_board_writer_member")
    )
    private Member writer;

    // 게시글 제목입니다.
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    // 게시글 본문입니다.
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    // 공지, 상품문의, 1:1문의 등 게시글 종류입니다.
    @Enumerated(EnumType.STRING)
    @Column(name = "board_type", nullable = false, length = 40)
    private BoardType boardType;

    // 다른 사용자에게 공개되는 글인지 여부입니다.
    @Column(name = "is_public", nullable = false)
    private Boolean publicVisible = true;

    // 관리자 답변 대기/완료 상태입니다.
    @Enumerated(EnumType.STRING)
    @Column(name = "answer_status", nullable = false, length = 20)
    private AnswerStatus answerStatus = AnswerStatus.WAITING;

    // 고객이 관리자 답변을 확인했는지 여부입니다.
    @Column(name = "answer_checked")
    private Boolean answerChecked = true;

    // 게시글 작성 시각입니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 게시글 마지막 수정 시각입니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 상품 문의일 때 연결되는 상품입니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    // 게시글 조회 수입니다.
    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    // 실제 삭제 대신 목록에서 제외하기 위한 소프트 삭제 여부입니다.
    @Column(name = "is_deleted", nullable = false)
    private Boolean deleted = false;

    // 1:1 문의 대분류입니다. 예: 주문/결제, 배송, 상품.
    @Column(name = "inquiry_category", length = 80)
    private String inquiryCategory;

    // 1:1 문의 중분류입니다.
    @Column(name = "inquiry_group", length = 80)
    private String inquiryGroup;

    // 1:1 문의 세부 주제입니다.
    @Column(name = "inquiry_topic", length = 120)
    private String inquiryTopic;

    // 문의자가 입력한 연락 담당자 이름입니다.
    @Column(name = "contact_name", length = 80)
    private String contactName;

    // 문의자가 입력한 답변 받을 이메일입니다.
    @Column(name = "contact_email", length = 160)
    private String contactEmail;

    // 문의와 관련된 주문번호입니다.
    @Column(name = "order_number", length = 80)
    private String orderNumber;

    // 문의와 관련된 차량 정보입니다.
    @Column(name = "vehicle_info", length = 255)
    private String vehicleInfo;

    protected Board() {
    }

    public Board(
            Member writer,
            String title,
            String content,
            BoardType boardType,
            String inquiryCategory,
            String inquiryGroup,
            String inquiryTopic,
            String contactName,
            String contactEmail,
            String orderNumber,
            String vehicleInfo
    ) {
        this.writer = writer;
        this.title = title;
        this.content = content;
        this.boardType = boardType;
        this.inquiryCategory = inquiryCategory;
        this.inquiryGroup = inquiryGroup;
        this.inquiryTopic = inquiryTopic;
        this.contactName = contactName;
        this.contactEmail = contactEmail;
        this.orderNumber = orderNumber;
        this.vehicleInfo = vehicleInfo;
    }

    public Long getBoardId() {
        return boardId;
    }

    public Member getWriter() {
        return writer;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public BoardType getBoardType() {
        return boardType;
    }

    public AnswerStatus getAnswerStatus() {
        return answerStatus;
    }

    public Boolean getAnswerChecked() {
        return answerChecked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getInquiryCategory() {
        return inquiryCategory;
    }

    public String getInquiryGroup() {
        return inquiryGroup;
    }

    public String getInquiryTopic() {
        return inquiryTopic;
    }

    public String getContactName() {
        return contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public String getVehicleInfo() {
        return vehicleInfo;
    }

    // 관리자가 답변을 등록했을 때 답변 완료 상태로 바꾸고, 고객에게 미확인 답변이 있음을 표시합니다.
    public void markAnswered() {
        answerStatus = AnswerStatus.ANSWERED;
        answerChecked = false;
    }

    // 고객이 답변을 확인했을 때 읽음 상태로 바꿉니다.
    public void markAnswerChecked() {
        answerChecked = true;
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
