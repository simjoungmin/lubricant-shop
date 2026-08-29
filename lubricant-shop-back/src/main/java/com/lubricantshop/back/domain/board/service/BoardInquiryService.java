package com.lubricantshop.back.domain.board.service;

import com.lubricantshop.back.domain.board.AnswerStatus;
import com.lubricantshop.back.domain.board.Board;
import com.lubricantshop.back.domain.board.BoardAnswer;
import com.lubricantshop.back.domain.board.BoardType;
import com.lubricantshop.back.domain.board.dto.AnswerCreateRequest;
import com.lubricantshop.back.domain.board.dto.InquiryCreateRequest;
import com.lubricantshop.back.domain.board.dto.InquiryDetailResponse;
import com.lubricantshop.back.domain.board.dto.InquiryResponse;
import com.lubricantshop.back.domain.board.repository.BoardAnswerRepository;
import com.lubricantshop.back.domain.board.repository.BoardRepository;
import com.lubricantshop.back.domain.member.entity.Member;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BoardInquiryService {

    private final BoardRepository boardRepository;
    private final BoardAnswerRepository boardAnswerRepository;
    private final BoardInquiryAuthorization authorization;
    private final BoardInquiryResponseAssembler responseAssembler;

    public BoardInquiryService(
            BoardRepository boardRepository,
            BoardAnswerRepository boardAnswerRepository,
            BoardInquiryAuthorization authorization,
            BoardInquiryResponseAssembler responseAssembler
    ) {
        this.boardRepository = boardRepository;
        this.boardAnswerRepository = boardAnswerRepository;
        this.authorization = authorization;
        this.responseAssembler = responseAssembler;
    }

    @Transactional
    public InquiryResponse createInquiry(Long writerId, InquiryCreateRequest request) {
        Member writer = authorization.findMember(writerId);
        Board board = new Board(
                writer,
                request.title().trim(),
                request.content().trim(),
                BoardType.ONE_TO_ONE,
                trimToNull(request.inquiryCategory()),
                trimToNull(request.inquiryGroup()),
                trimToNull(request.inquiryTopic()),
                request.contactName().trim(),
                request.contactEmail().trim(),
                trimToNull(request.orderNumber()),
                trimToNull(request.vehicleInfo())
        );

        return InquiryResponse.from(boardRepository.save(board));
    }

    @Transactional(readOnly = true)
    public List<InquiryResponse> findAdminInquiries(Long adminId) {
        authorization.requireAdmin(adminId);
        return boardRepository.findByBoardTypeAndDeletedFalseOrderByCreatedAtDesc(BoardType.ONE_TO_ONE)
                .stream()
                .map(InquiryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public InquiryDetailResponse findAdminInquiry(Long adminId, Long boardId) {
        authorization.requireAdmin(adminId);
        return responseAssembler.toDetailResponse(findInquiry(boardId));
    }

    @Transactional
    public InquiryDetailResponse createAnswer(Long adminId, Long boardId, AnswerCreateRequest request) {
        Member admin = authorization.requireAdmin(adminId);
        Board board = findInquiry(boardId);
        BoardAnswer answer = new BoardAnswer(board, admin, request.content().trim());
        boardAnswerRepository.save(answer);
        board.markAnswered();

        return responseAssembler.toDetailResponse(board);
    }

    @Transactional(readOnly = true)
    public List<InquiryResponse> findMyInquiries(Long writerId) {
        authorization.findMember(writerId);
        return boardRepository.findByWriterMemberIdAndBoardTypeAndDeletedFalseOrderByCreatedAtDesc(writerId, BoardType.ONE_TO_ONE)
                .stream()
                .map(InquiryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public InquiryDetailResponse findMyInquiry(Long writerId, Long boardId) {
        Board board = findInquiry(boardId);
        authorization.requireOwner(writerId, board);
        return responseAssembler.toDetailResponse(board);
    }

    @Transactional
    public InquiryDetailResponse markMyInquiryAnswerChecked(Long writerId, Long boardId) {
        Board board = findInquiry(boardId);
        authorization.requireOwner(writerId, board);
        board.markAnswerChecked();
        return responseAssembler.toDetailResponse(board);
    }

    @Transactional(readOnly = true)
    public boolean hasUnreadAnswer(Long writerId) {
        authorization.findMember(writerId);
        return boardRepository.existsByWriterMemberIdAndBoardTypeAndAnswerStatusAndAnswerCheckedFalseAndDeletedFalse(
                writerId,
                BoardType.ONE_TO_ONE,
                AnswerStatus.ANSWERED
        );
    }

    private Board findInquiry(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("문의가 존재하지 않습니다."));

        if (board.getBoardType() != BoardType.ONE_TO_ONE) {
            throw new IllegalArgumentException("1:1 문의가 아닙니다.");
        }

        return board;
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
