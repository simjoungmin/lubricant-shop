package com.lubricantshop.back.domain.board;

import com.lubricantshop.back.domain.member.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

// 고객 문의나 게시글에 관리자가 남긴 답변을 저장하는 엔티티입니다.
@Entity
@Table(name = "board_answer")
public class BoardAnswer {

    // 답변 고유 ID입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long answerId;

    // 답변이 달린 원본 게시글입니다.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    // 답변을 작성한 관리자 회원입니다.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private Member admin;

    // 관리자 답변 본문입니다.
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    // 답변 작성 시각입니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 답변 마지막 수정 시각입니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected BoardAnswer() {
    }

    public BoardAnswer(Board board, Member admin, String content) {
        this.board = board;
        this.admin = admin;
        this.content = content;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public Board getBoard() {
        return board;
    }

    public Member getAdmin() {
        return admin;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
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
